# Bento content progress

| Item / route                                    | Status                        | Remaining work                                                                                                                     |
| ----------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Stock colors - `/tags/stock-colors`             | Complete                      | Approved by Bob. Maintain existing artwork, color studio, marquee, and sample picker.                                              |
| Shipping - `/tags/shipping`                     | Design implemented; demo data | Replace illustrative globe locations/origin with supplied shipment data. Review final shipping copy with real operational details. |
| Printing, materials, shapes, formats, numbering | Scaffold                      | Develop one topic at a time.                                                                                                       |

Shipping coverage (all 50 states and internationally) was supplied by Bob. Demo cities are not evidence of actual shipments. No transit times, carrier promises, delivery volumes, or country totals are implied.

The local globe land dots are derived from public-domain Natural Earth 1:110m land polygons: https://www.naturalearthdata.com/about/terms-of-use/
Regenerate with `node scripts/build-globe-land.mjs`. The script downloads the official Natural Earth repository source; the customer-facing site uses only the generated local asset.
