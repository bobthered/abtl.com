# Contact

Dedicated contact route replacing the old LandingPage placeholder and malformed contact mailto strings. ContentLayout renders the title, two alternating body sections, and a contrasting centered phone CTA. The form uses Sveltewind primitives, labeled inputs, server-rendered feedback, and SvelteKit progressive enhancement through fromAction. The location section uses the same golden-hour aerial plant photo as the first image on About, with the shared LightboxImage interaction. Directions open an external Maps search. The body includes inquiry, address, and phone sections.

## Public details

The recipient is fixed to sales@abtl.com, explicitly confirmed by the owner. Street address (3177 Lehigh St., Caledonia, NY 14423) and toll-free phone (800.541.8868) were verified October 17, 2026 against the company-specific [Ennis profile](https://www.ennis.com/allen-bailey-tag-label/). A general locations directory lists another phone, so this page follows the company-specific profile. No opening hours, response-time promise, visitor policy, or shipping turnaround is invented. Public contact details are centralized in src/lib/data/contact.ts.

## Activate delivery

The repository had no form backend or email service configured. This implementation uses the Resend HTTPS API without a new runtime dependency. Set server-only RESEND_API_KEY and CONTACT_FROM_EMAIL in the deployment environment; the sender must belong to a domain verified in Resend. See the root .env.example. Never use the visitor's address as From. The recipient cannot be changed by form fields; validated visitor email is reply_to. Only an accepted provider response with a message id is treated as success. No auto-reply, file upload, local database, or application logging of inquiry text is added.

Until both settings exist, sending is disabled and a visible notice points to email/phone. Direct POSTs fail honestly with 503 and retain fields rather than claiming delivery. Client connection errors, provider rejection, timeout, and malformed responses also preserve input and offer direct email. Actual delivery must be checked after credentials and sender-domain setup; local tests mock the provider and never send mail.

Validation trims fields, requires name/email/message, bounds field lengths, rejects oversized declared requests and a honeypot, and sends plain text with a fixed subject prefix. SvelteKit retains same-origin form protection. No distributed rate-limit service or CAPTCHA is configured; assess deployment-level abuse controls before enabling a public email endpoint. API acceptance is not proof of inbox delivery; monitor the provider after activation. Ensure your privacy/retention terms match operational handling.

Coverage tests validation, header-injection rejection, payload routing, reply-to, missing configuration, provider/network failures, responsive themes, native controls, and preserved no-JavaScript POST failures. Successful provider acceptance is tested with an injected fake fetch, not a live email.

## Plant photo

The location image reuses `/images/about/golden-hour-industrial-complex-aerial.webp` with its 1200 by 533 intrinsic dimensions in the existing responsive image panel. LightboxImage provides the shared expansion, outline, and full-image dialog. The map SDK, iframe fallback, browser API key exposure, and map-only configuration and dependencies have been removed. The existing external directions link is retained.
