# Bento content progress

| Item / route                          | Status                                | Remaining work                                                                                                                     |
| ------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Stock colors - `/tags/stock-colors`   | Complete                              | Approved by Bob. Maintain existing artwork, color studio, marquee, and sample picker.                                              |
| Shipping - `/tags/shipping`           | Design implemented; demo data         | Replace illustrative globe locations/origin with supplied shipment data. Review final shipping copy with real operational details. |
| Variable data - `/tags/variable-data` | Design implemented; illustrative data | Review copy and examples; replace sample records with approved examples if desired.                                                |
| Materials, shapes, formats, numbering | Scaffold                              | Develop one topic at a time.                                                                                                       |

The declined custom-printing concept was replaced by variable data. The former `/tags/printing` placeholder redirects to `/tags/variable-data`.

The variable data tile uses transparent QR modules in the current text color over transparent orbital canvas artwork. Four thousand small, solid-color particles follow four elliptical paths while visible, with stable random offsets in both perpendicular directions. Hover and keyboard focus run a scanning sweep; reduced motion shows static spheres and scanner brackets. Orbiting pauses offscreen or in a hidden tab, and scanning also stops while idle.

Variable data capabilities (barcodes, QR codes, sequential numbering, and personalization for mailings) were supplied by Bob. Names, addresses, item descriptions, and IDs in the demonstrations are fictional. Codes encode the displayed sample ID, not a live asset record. No database integration, mailing fulfillment, or scanner compatibility guarantee is implied. Generate sample SVG artwork with `npm run images:variable-data`; the encoder is a development dependency and is not imported by customer-facing code.

Shipping coverage (all 50 states and internationally) was supplied by Bob. Demo cities are not evidence of actual shipments. No transit times, carrier promises, delivery volumes, or country totals are implied.

The local globe land dots are derived from public-domain Natural Earth 1:110m land polygons: https://www.naturalearthdata.com/about/terms-of-use/
Regenerate with `node scripts/build-globe-land.mjs`. The script downloads the official Natural Earth repository source; the customer-facing site uses only the generated local asset.
