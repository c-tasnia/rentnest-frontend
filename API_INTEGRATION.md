# API Integration Map

Maps each frontend piece to the backend endpoint(s) it consumes. Backend base URL is set via `NEXT_PUBLIC_API_URL`.

| Frontend Route | Hook | Backend Endpoint(s) |
|---|---|---|
| `/` (home, featured properties) | `useProperties` (`hooks/useProperties.ts`) | `GET /api/properties` |
| `/properties` (full browse + filters) | `useProperties`, `useCategories` | `GET /api/properties`, `GET /api/categories` |
| `/properties/[id]` | `useProperty`, `useCreateRentalRequest` | `GET /api/properties/:id`, `POST /api/rentals` |
| `/auth/register` | `useRegister` (`hooks/useAuth.ts`) | `POST /api/auth/register` |
| `/auth/login` | `useLogin` (`hooks/useAuth.ts`) | `POST /api/auth/login` |
| `middleware.ts` (route protection for `/dashboard/*`) | reads `token`/`role` cookies set at login | — (edge-side check only; 401s from any API call clear auth via axios interceptor) |
| `/dashboard/tenant` | `useMyRentalRequests`, `useMyPayments`, `useCreateReview` | `GET /api/rentals`, `GET /api/payments`, `POST /api/reviews` |
| `/dashboard/tenant/requests/[id]/pay` | `useCreatePaymentSession` | `POST /api/payments/create` |
| `/payment/success`, `/payment/cancel` | reads `status`/`tranId` query params | Backend redirects here after `POST /api/payments/confirm` (SSLCommerz callback) |
| `/dashboard/landlord` | `useMyProperties`, `useDeleteProperty`, `useLandlordRequests` (for stats) | `GET /api/landlord/properties`, `DELETE /api/landlord/properties/:id`, `GET /api/landlord/requests` |
| `/dashboard/landlord/properties/new` | `useCreateProperty` | `POST /api/landlord/properties` |
| `/dashboard/landlord/properties/[id]/edit` | `useProperty`, `useUpdateProperty` | `GET /api/properties/:id`, `PUT /api/landlord/properties/:id` |
| `/dashboard/landlord/requests` | `useLandlordRequests`, `useUpdateRentalStatus` (optimistic) | `GET /api/landlord/requests`, `PATCH /api/landlord/requests/:id` |
| `/dashboard/admin` | `useAdminUsers`, `useAdminProperties`, `useAdminRentals` | `GET /api/admin/users`, `GET /api/admin/properties`, `GET /api/admin/rentals` |
| `/dashboard/admin/users` (search + pagination) | `useAdminUsers`, `useUpdateUserStatus` | `GET /api/admin/users`, `PATCH /api/admin/users/:id` |
| `/dashboard/admin/properties` | `useAdminProperties` | `GET /api/admin/properties` |
| `/dashboard/admin/rentals` | `useAdminRentals` | `GET /api/admin/rentals` |

## Auth flow

1. `POST /api/auth/register` or `/api/auth/login` returns `{ user, token }`.
2. `useAuthStore` (`lib/auth-store.ts`) saves `user` to localStorage and writes `token`/`role` to cookies via `js-cookie`.
3. `lib/api.ts` (axios instance) attaches `Authorization: Bearer <token>` to every outgoing request automatically.
4. `middleware.ts` reads the `token`/`role` cookies at the edge to gate `/dashboard/tenant/*`, `/dashboard/landlord/*`, `/dashboard/admin/*` before the page renders.
5. On any `401` response, the axios interceptor clears auth and redirects to `/auth/login`.

## Payment flow (dedicated pages)

1. Tenant dashboard links to `/dashboard/tenant/requests/[id]/pay` for an APPROVED request.
2. That page calls `POST /api/payments/create` on mount and redirects to the returned `gatewayUrl` (SSLCommerz hosted checkout).
3. After checkout, SSLCommerz hits the backend's `/api/payments/confirm`, which verifies the transaction and redirects to `{FRONTEND_URL}/payment/success?tranId=...` or `{FRONTEND_URL}/payment/cancel?tranId=...` depending on outcome.
4. Those two dedicated pages show the appropriate success/fail UI.

**Backend requirement:** `payment.controller.ts`'s `confirmPayment` must redirect to `/payment/success` or `/payment/cancel` (not a single combined page) — see this frontend's README for the exact change.

## Error handling

All backend responses follow `{ success, message, data }` (success) or `{ success: false, message, errorDetails }` (error). `getApiErrorMessage()` in `lib/api.ts` extracts `message` from failed responses and every mutation displays it via a `sonner` toast (`toast.error(...)`). Form-level validation errors are caught client-side by Zod + React Hook Form before a request is even sent. `error.tsx` and `not-found.tsx` handle unexpected render errors and 404s respectively; `PropertyGridSkeleton` shows skeleton loaders during data fetching instead of layout shift.

