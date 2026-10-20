# Itelier Noir

Contemporary fashion and Nigerian custom wear storefront built with Next.js 16, React 19, Prisma and Zustand.

## Start locally

Use Node.js 22 or 24 and npm:

```sh
npm ci
npm run db:setup
npm run dev
```

Open http://localhost:3000. Setup creates a local SQLite database and a random authentication secret if `.env` does not exist, then safely upserts 18 products. Repeating the seed preserves existing product edits, customer accounts, orders and inventory levels. Use `node prisma/seed.mjs --refresh-catalog` only when intentionally refreshing the original catalog. It never creates sample customers or accounts with published passwords.

SQLite makes this checkout self-contained. The uploaded project's original PostgreSQL database and credentials have not been modified or copied into this repository. Production uses the PostgreSQL schema in `prisma/schema.prisma`. Local development uses `prisma/schema.local.prisma`. The build selects its Prisma provider from `DATABASE_URL`. On Vercel, set a PostgreSQL connection string, initialize its schema and seed the catalog before accepting orders. Do not deploy the local SQLite file to ephemeral server storage.

## Catalog and imagery

- 18 distinct garments: 11 retained concepts and 7 added products, including agbada, kaftan, adire, linen separates and occasion wear.
- Each product has its own local optimized WebP image, matching colour, description, size options, fabric and care notes.
- Eight additional images support the homepage and category campaigns.
- `src/data/products.json` is the initial catalog, shared by preview browsing and the non-destructive seed. Once seeded, database edits control live prices, stock, visibility and images.
- Product images and campaign assets are AI-generated concepts, not photographs documenting manufactured inventory. Confirm specifications, prices, sizing, stock and imagery against actual goods before opening for sales.
- Image briefs and provenance: [IMAGE-BRIEFS.md](IMAGE-BRIEFS.md).

## Features

- Responsive editorial homepage; men, women, archive, all-products and collection routes.
- Search, colour, size, price, availability and product filters, with sale-aware sorting.
- Product detail galleries, size guide, variant selection, quick add and persistent favorites.
- Cart quantity validation and stock limits shared across size selections.
- Three-step checkout with one shipping calculation on the browser and server; free express at ₦150,000.
- Server-priced orders, validated coupons and a hosted Paystack payment flow.
- Verified payment amounts, currency, customer email and exact order reference; duplicate callbacks cannot decrement inventory twice. A paid order with a stock conflict is placed on hold for the merchant.
- Scrypt password hashing, legacy hash upgrade on login, signed cookies, customer order history and persistent delivery addresses.
- Admin merchandising, order management, coupon and review moderation. Removing a product hides it while retaining order history.
- Newsletter storage, order tracking, fitting guidance, accessible focus states and branded metadata.

## Payments

Set `PAYSTACK_SECRET_KEY` in `.env` and set `NEXT_PUBLIC_APP_URL` to your actual site origin. The app initializes a hosted transaction and verifies it with Paystack before marking an order paid. Missing or mock keys produce a clear checkout message, not a simulated successful charge. Payment processing has not been tested with a merchant account or real money.

Paystack is the configured gateway. The previous simulated Flutterwave and cryptocurrency payment paths were removed from checkout. Customers keep their cart if payment is interrupted and can retry verification from the return page. Fulfillment, refunds and paid orders on hold require merchant attention. Add a verified provider webhook before relying on payment reconciliation when a customer closes the browser before returning.

## Administrator setup

The production owner can activate access using a private, single-use invitation and choose their own password. The configured email is reserved from public registration. An invitation expires after 24 hours and stops working once the owner account is activated. Its secret is stored only in the deployment environment, never in this repository.

Register your own account, then grant that account admin access from the project directory:

```sh
node --env-file=.env prisma/promote-admin.mjs owner@example.com
```

Set `OWNER_EMAIL` in Vercel to this exact email. Product uploads, additions and edits require both the matching email and a database administrator role; access is checked on the server. The owner editor supports image uploads, cover selection, image removal, size selection and colour swatches. Uploaded photos are resized and saved durably with the product in the database, so they survive Vercel deployments.

Public registration always creates a customer. The first visitor cannot claim administrator privileges.

To update an existing product, sign in as the configured owner, open `/admin`, choose **Products → Edit**, and use **Images, sizes & colours**. Add photos without replacing the gallery, choose a cover, select sizes, and add named colour swatches. Click **Save product** to publish the changes. A product must keep at least one image, size and colour.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Core tests cover image uniqueness and existence, shipping thresholds, search/filter/sale behavior, catalog fallback, password compatibility and cart stock limits.

Local verification: 12 automated tests pass and the production build succeeds. Browser checks cover 13 routes, registration, owner-only uploads, gallery append, saved size/colour changes, address persistence, quick add, favorites, checkout configuration feedback and responsive layout. Real merchant payments and production database connectivity remain dependent on the deployment credentials.

## Before a public launch

Replace the original template's business biography, contact details, social profiles, delivery estimates and fitting measurements with confirmed brand information. Define the merchant's returns policy. Email verification and password-reset emails are not integrated; newsletter signups are stored without sending campaigns. Never commit `.env`, database files, or customer data.

API references used: [Next.js pages](https://nextjs.org/docs/app/api-reference/file-conventions/page) and [Paystack transactions](https://paystack.com/docs/api/transaction/).

