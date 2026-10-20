import {getOwner} from "@/utils/owner";
import {validateProductInput} from "@/utils/product-validation";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { getUserFromRequest } from "@/utils/auth";

// Helper helper to generate a slug from a title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET all products for admin (including invisible products)
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Admin Products GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create a new product
export async function POST(request: NextRequest) {
  try {
    if(!await getOwner(request))return NextResponse.json({error:"Only the website owner can change products."},{status:403});
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationError=validateProductInput(body);
    if(validationError)return NextResponse.json({error:validationError},{status:400});
    const {
      title,
      description,
      basePrice,
      salePrice,
      stock,
      category,
      badge,
      images, // expects stringified array or array
      sizes,  // expects stringified array or array
      colors, // expects stringified array or array
      material,
      care,
      isVisible,
    } = body;

    if (!title || !description || basePrice === undefined || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slugBase = generateSlug(title);
    let slug = slugBase;
    let counter = 1;

    // Ensure slug uniqueness
    while (await db.product.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${counter}`;
      counter++;
    }

    const product = await db.product.create({
      data: {
        title,
        description,
        slug,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice !== undefined && salePrice !== null ? parseFloat(salePrice) : null,
        stock: parseInt(stock) || 0,
        category: category.toUpperCase(),
        badge: badge || null,
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        sizes: typeof sizes === "string" ? sizes : JSON.stringify(sizes || ["S", "M", "L"]),
        colors: typeof colors === "string" ? colors : JSON.stringify(colors || []),
        material: material || "",
        care: care || "",
        isVisible: isVisible !== undefined ? !!isVisible : true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Admin Product POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update a product
export async function PUT(request: NextRequest) {
  try {
    if(!await getOwner(request))return NextResponse.json({error:"Only the website owner can change products."},{status:403});
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationError=validateProductInput(body);
    if(validationError)return NextResponse.json({error:validationError},{status:400});
    const {
      id,
      title,
      description,
      basePrice,
      salePrice,
      stock,
      category,
      badge,
      images,
      sizes,
      colors,
      material,
      care,
      isVisible,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const data: any = {};
    if (title !== undefined) {
      data.title = title;
      // Optionally regenerate slug if title changes
      if (title !== existing.title) {
        const slugBase = generateSlug(title);
        let slug = slugBase;
        let counter = 1;
        while (await db.product.findFirst({ where: { slug, id: { not: id } } })) {
          slug = `${slugBase}-${counter}`;
          counter++;
        }
        data.slug = slug;
      }
    }
    if (description !== undefined) data.description = description;
    if (basePrice !== undefined) data.basePrice = parseFloat(basePrice);
    if (salePrice !== undefined) data.salePrice = salePrice !== null ? parseFloat(salePrice) : null;
    if (stock !== undefined) data.stock = parseInt(stock);
    if (category !== undefined) data.category = category.toUpperCase();
    if (badge !== undefined) data.badge = badge || null;
    if (images !== undefined) data.images = typeof images === "string" ? images : JSON.stringify(images);
    if (sizes !== undefined) data.sizes = typeof sizes === "string" ? sizes : JSON.stringify(sizes);
    if (colors !== undefined) data.colors = typeof colors === "string" ? colors : JSON.stringify(colors);
    if (material !== undefined) data.material = material;
    if (care !== undefined) data.care = care;
    if (isVisible !== undefined) data.isVisible = !!isVisible;

    const product = await db.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Admin Product PUT Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request: NextRequest) {
  try {
    if(!await getOwner(request))return NextResponse.json({error:"Only the website owner can change products."},{status:403});
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.product.update({
      where: { id },
      data: {isVisible:false},
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Admin Product DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
