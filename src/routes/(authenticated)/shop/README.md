# Invitation-only shop foundation

Public entry: `/sign-in`. `/shop` sends anonymous visitors there and shows signed-in buyers their company-assigned markets. The first protected market is `/shop/fire-suppression`.

## Current behavior

- Desktop and mobile header links reach a SvelteKit remote sign-in form. In development, the form displays temporary credentials (`beta@example.com` / `FireBeta2026!`). Signed-in visitors see a Shop link. No public registration or live invitations are available.
- A server-only company membership contract separates user identity, company, customer type, and assigned markets. Direct and distributor buyers can each have multiple markets.
- Fire suppression checks membership before returning any catalog data and disables response caching. Anonymous users redirect; members without market access receive 403.
- `/shop` lists only recognized assigned markets, without duplicates. Fire suppression opens its catalog; assigned markets without a published shop show a coming-soon status. Sign-in always lands at `/shop`, including for single-market accounts. The demo company has Fire Suppression and Shellfish to illustrate this.
- The protected fire suppression landing page groups existing product offerings into tags, labels, and collars. Prices, variants, purchasing, saved artwork, and orders are not yet implemented.
- Development sign-in runs in `src/routes/sign-in/sign-in.remote.ts` and sets a 30-day HttpOnly SameSite cookie signed with the stable server-only `SHOP_SESSION_SECRET` (at least 32 random characters). The hook verifies expiry and signature before populating the fixed demo company membership. Sessions survive restarts when the secret is unchanged; secret rotation invalidates them and signing out deletes the browser cookie. Forged browser values cannot grant access.
- Demo authentication is hard-disabled outside SvelteKit development mode, including preview and production builds. Production never exposes demo credentials or accepts demo sessions. This is a local review account, not a customer identity system. Do not put real customer data in this workspace.

## Next integration

Choose the identity, durable storage, and commerce providers before enabling production sign-in. Replace the temporary demo hook and form action with verified provider sessions. The server hook must verify the provider session on every request, load current company membership from trusted storage, and then populate `locals.shopMember`. Never populate it from unsigned browser data. Future product, cart, checkout, artwork, and order endpoints must repeat authorization; page protection alone is not sufficient.

Invitations should store a hashed random token, normalized recipient email, company, assigned markets, issuer, expiry, and acceptance state in durable storage. Acceptance must verify the recipient and atomically consume the invitation once. Revocation and company membership changes must take effect on subsequent requests. Keep raw tokens out of logs and analytics; do not issue live invitations until this lifecycle is implemented.

Company management and invitation issuance belong in the separate internal administration project. This site should own invitation acceptance and customer purchasing. Do not add an unauthenticated invitation-creation endpoint here.

Resolve whether new designs require artwork and price approval before payment, plus catalog availability, quantity rules, tax/shipping/payment integration, and distributor pricing before enabling checkout. Product categories here are navigation scaffolding, not purchasable SKUs.

## Market artwork

The private shop `MarketArtwork` composition reuses the route-owned market illustrations for all six assigned-market cards. Product artwork remains owned by each market rather than duplicating shapes or importing full market pages. Each preview uses the same 3:2 stage with a fixed square illustration viewport and theme-aware primary/secondary background. Preview artwork is decorative; the market heading and catalog link supply accessible labels.

## Fire suppression ordering demo

The market page offers server-side search by order, product, customer reference, and artwork, plus per-item quantity and reorder review. A separate new-product form covers the existing fire suppression range. Both POST actions recheck company/market access and validate products and quantities. Review summaries are transient action responses: no draft is stored, no request is sent, and no order or charge is created.

Eighteen fictional order lines with distinct SKUs, PO numbers, and descriptions are available only to the demo company. Other authorized companies receive an empty history. Replace the fixture repository with a company-and-market-scoped order query before importing real records. Never trust a posted order ID without verifying ownership. Historical artwork references are shown for continuity; previews are illustrative product artwork, not actual approved customer proofs. Quantity limits are technical input bounds, not product minimums or pricing rules. Real reorders must confirm artwork revision, current pricing, availability, delivery address, and payment before submission.

### Larger order histories

A GET-based keyword search matches order number, PO number, SKU, description, customer reference, artwork, and ISO order date. Multiple words must all match the line. Product-type selection and inclusive date bounds combine with the query. Sorting supports newest, oldest, and SKU; deterministic tie-breaking and ten-line pages preserve filters in navigation URLs. Invalid or reversed dates show an error rather than silently broadening results. Result rows distinguish individual SKUs on orders with multiple lines.

The current repository filters synthetic records in memory. Replace it with an indexed database/order-system query that applies company and market ownership, filters, sorting, and pagination before returning rows. Do not load an entire real customer history into the browser. Product types are catalog categories; a SKU identifies the individual customer product/configuration.

## Route protection

Shop routes live under `src/routes/(authenticated)/shop`; the group does not change their public URLs. The root `src/hooks.server.ts` checks exact `(authenticated)` segments of `event.route.id` for every request, including POSTs and endpoints, and redirects anonymous or invalid-session requests to `/sign-in` before loaders and actions execute. Market loaders and POST actions retain separate company/market ownership checks. `/account/sign-in` redirects old bookmarks to `/sign-in`.

The remote form validates credentials server-side and uses `_password` so sensitive values are excluded from remote form repopulation. It supports enhanced submissions and native POST without JavaScript. Runtime code requires the stable signing secret and fails closed when missing. The demo remains development-only; durable identity storage, per-session revocation, password management, and real invitation acceptance are not yet implemented. A deleted cookie does not revoke a previously copied stateless demo token; production authentication must provide revocation.
