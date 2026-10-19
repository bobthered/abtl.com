# Authenticated shop

`/shop` opens directly to reorder search. There is one content section containing filters, paginated SKU-level results, and transient reorder reviews. The market chooser, large welcome section, and new-product section have been removed. `/shop/fire-suppression` redirects to `/shop` and retains query parameters for old links.

## Search and ownership

The current order repository has eighteen fictional fire suppression order lines for the demo company. Other companies receive no fixture history, and a member without fire suppression access receives no fire orders or product-type options. Search matches order, PO, SKU, description, reference, artwork, and ISO date; filters combine product type and inclusive dates with deterministic sorting and ten-line pagination. Real history must be queried by verified company AND assigned market in an indexed order-system/database query before pagination. Browser values never grant ownership.

Reorder POSTs validate company membership, line ownership, and integer quantity. Reviews are transient: no draft is saved, no order is placed, no payment is taken, and no cart item is created. Product previews are illustrative, not approved proofs. Quantity bounds are technical input limits, not minimum-order or pricing rules.

## Navigation and cart

The shared header Shop dropdown uses Sveltewind Popover for orders, cart, and a POST sign-out form. It supports desktop hover, click, keyboard access, outside dismissal, and the mobile navigation. Shop and megamenu items share the navigationItem theme variant (14px, medium weight, no underline); sign-out retains a native POST form with matching presentation. Shop uses subtleReveal and the same pt-6 hover bridge as the megamenu. `/shop/cart` is an authenticated empty state until durable cart storage is connected. Do not imply that a review has added items to the cart.

## Authentication

Public entry: `/sign-in`; `/account/sign-in` redirects old bookmarks. Sign-in uses the remote form in `src/routes/sign-in/sign-in.remote.ts`. Local credentials remain `beta@example.com` / `FireBeta2026!`. A 30-day HttpOnly SameSite session uses the server-only `SHOP_SESSION_SECRET`; it survives restarts while the secret is unchanged. Demo login is disabled outside development.

Shop routes live under `src/routes/(authenticated)/shop`. The root server hook checks exact `(authenticated)` route-group segments, verifies sessions, and redirects signed-out requests to `/sign-in` before loaders, actions, and endpoints. Order loaders and POSTs independently enforce data ownership. Password fields use the remote form's private-field convention.

Before production, connect durable customer identity, invitation lifecycle, per-session revocation, real order history, carts, pricing, shipping/tax, and payments. The temporary stateless demo token cannot be individually revoked after copying it; sign-out deletes the browser cookie and secret rotation invalidates all tokens. Internal invitation management belongs in the separate company administration project.
