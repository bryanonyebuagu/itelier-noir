# Itelier Noir

A contemporary fashion storefront focused on Nigerian custom wear, built with Next.js, React, TypeScript, Prisma, and Zustand.

**Live demo:** [itelier-noir.vercel.app](https://itelier-noir.vercel.app/)

I built this project to explore a complete commerce experience, from editorial product discovery through cart and checkout, alongside the tools needed to manage a catalog.

## Highlights

- Responsive storefront with collection pages, search, filtering, sorting, and product galleries.
- Variant selection, size guidance, favorites, cart validation, and stock-aware quantities.
- Three-step checkout with server-priced orders, coupon validation, and Paystack transaction initialization and verification.
- Product, order, coupon, and review management in an owner-restricted admin area.
- Persistent customer accounts, delivery addresses, order history, and security controls.
- Shared interface patterns, responsive layouts, and visible keyboard focus states.

## Catalog and imagery

The catalog contains 200 product entries across men's, women's, and children's collections, including Nigerian and contemporary styles such as agbada, kaftan, and adire. It also includes category and homepage campaign imagery.

Product and campaign images include AI-generated concepts and sourced imagery. They are presentation assets, not evidence of manufactured stock. See [image briefs](IMAGE-BRIEFS.md) and [image sources](IMAGE-SOURCES.md) for provenance. Catalog descriptions, prices, sizes, and availability are demonstration data and should be verified against real products before commercial use.

## Tech stack

- Next.js 16, React 19, TypeScript
- Prisma with SQLite for local development and PostgreSQL for production
- Zustand for client state
- Paystack hosted checkout integration

## Run locally

Use Node.js 22 or 24 and npm:

```sh
npm ci
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Local setup creates a SQLite database and a development authentication secret when needed, then seeds the catalog. The seed is designed to preserve existing edits and records when run again.

For production, configure a PostgreSQL `DATABASE_URL` and the required deployment environment variables. See `.env.example` for the configuration names. Do not commit secrets or local database files.

## Payments and email

Paystack transaction initialization and server-side verification are implemented. A merchant account and valid environment configuration are required for live transactions; live payment processing has not been verified with a merchant account. Email verification, password reset email delivery, and newsletter campaign delivery are not integrated.

## Quality checks

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

The test suite covers catalog imagery, shipping thresholds, product filtering, catalog fallback, password compatibility, and cart stock limits. The repository also documents browser checks for core customer and owner workflows.

## Project notes

The project uses a local SQLite database for a self-contained development setup. Production configuration uses PostgreSQL. See the scripts and Prisma schemas for environment-specific setup details.
