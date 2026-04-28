# Farmer Marketplace

Support farmers to produce value‑added agricultural products and connect them with buyers through a demo web platform.

This is a **Vite + React** demo marketplace with **role-based flows**:

- **Admin**: approve listings, view users, monitor orders
- **Farmer**: create/edit products, manage inventory, see orders containing their items
- **Buyer**: browse approved products, add to cart, checkout, view orders, leave feedback

An “AI copy helper” is included to generate product descriptions (local, deterministic demo logic).

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Demo accounts (seeded on first run)

- **Admin**: `admin@fsad.local` / `admin123`
- **Farmer**: `farmer@fsad.local` / `farmer123`
- **Buyer**: `buyer@fsad.local` / `buyer123`

## Notes

- Data is stored in **browser localStorage** (no backend yet).
- Product listings created/edited by farmers become **pending** until an admin approves them.
