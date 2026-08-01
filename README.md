# RentNest Frontend

Next.js (App Router) + TypeScript + Tailwind frontend for the RentNest rental marketplace, consuming the [RentNest backend API](../rentnest-backend).

## Stack
Next.js 14 App Router, TypeScript, Tailwind CSS, React Hook Form + Zod, TanStack Query, Zustand, axios, sonner (toasts), lucide-react (icons).

## 1. Install
```bash
npm install
```

## 2. Configure environment
```bash
cp .env.example .env.local
```
Set `NEXT_PUBLIC_API_URL` to your backend's base API URL, e.g.:
```
NEXT_PUBLIC_API_URL=https://rentnest-mocha.vercel.app/api
```

## 3. Run it
```bash
npm run dev
```
Open http://localhost:3000

## 4. Build for production
```bash
npm run build
npm start
```

## How auth & roles work

- Register/login stores the JWT in a cookie (readable by `middleware.ts`) plus the user object in localStorage (via Zustand's `persist`).
- `middleware.ts` protects `/tenant/*`, `/landlord/*`, `/admin/*` — unauthenticated users are redirected to `/login`, and wrong-role users are redirected home.
- Every API call automatically attaches the JWT via an axios interceptor (`src/lib/api.ts`). A `401` response logs the user out and redirects to `/login`.

## Folder structure
```
src/
  app/
    (home)          / and /properties (browse + filters)
    auth/           /auth/login, /auth/register
    dashboard/
      tenant/       /dashboard/tenant, /dashboard/tenant/requests/[id]/pay
      landlord/     /dashboard/landlord, /properties/new, /properties/[id]/edit, /requests
      admin/        /dashboard/admin, /users, /properties, /rentals
    payment/        /payment/success, /payment/cancel
  components/     Navbar, PropertyCard, PropertyForm, Providers, ui/ primitives
  hooks/          TanStack Query hooks per resource (auth, properties, rentals, payments, admin)
  lib/            api client, zustand auth store, zod schemas, shared types
  middleware.ts   role-based route protection for /dashboard/*
```

## Payment flow
1. Tenant clicks "Pay now" on an APPROVED request → goes to `/dashboard/tenant/requests/[id]/pay`, which calls `POST /api/payments/create` and redirects to the returned `gatewayUrl`.
2. Browser redirects to SSLCommerz's hosted checkout at that URL.
3. After checkout, SSLCommerz redirects to the backend's `/api/payments/confirm`, which verifies the transaction and should redirect to `{FRONTEND_URL}/payment/success?tranId=...` or `{FRONTEND_URL}/payment/cancel?tranId=...`.
4. `app/payment/success/page.tsx` and `app/payment/cancel/page.tsx` read those query params and show the appropriate state.

**Required backend change:** if your backend's `payment.controller.ts` still redirects to a single `/payment-result?status=...` page, update it to redirect to `/payment/success` or `/payment/cancel` instead:
```typescript
const redirectUrl =
  payment.status === "COMPLETED"
    ? `${config.frontendUrl}/payment/success?tranId=${payment.transactionId}`
    : `${config.frontendUrl}/payment/cancel?tranId=${payment.transactionId}`;
```

**Optional backend change (for landlord earnings stat):** `GET /api/landlord/requests` currently doesn't include payment data. If you want the "Earnings" stat on `/dashboard/landlord` to be accurate, add `payment: true` to the `include` in `listRequestsForLandlord` (`src/services/rental.service.ts`) on the backend. Without it, earnings will show ৳0.

**Important:** set your backend's `FRONTEND_URL` env var to wherever this frontend is deployed.

## Notes
- Admin login uses the same `/auth/login` page — log in with the admin credentials seeded on the backend (`ADMIN_EMAIL` / `ADMIN_PASSWORD` from the backend's `.env`).
- Badge colors follow the spec: Pending = gold/amber, Approved = blue, Rejected = red, Active = green, Completed = gray.
- See `API_INTEGRATION.md` for the full endpoint-to-route map.
"# rentnest-frontend" 
"# rentnest-frontend" 
