# Internal shipment reference

These processed records and reconciliation files are server-only. Never import them into shared components or client modules. The original `shipments.csv` export is not present in the committed repository; its SHA-256 hash is recorded in `review.json`. Any future source export must stay outside the static asset directory.

`npm run shipments:build` exports only whitelisted location fields and coordinate pairs from this processed snapshot into `src/lib/data/shipments`. It does not geocode a new CSV. New exports must first be validated and mapped into these internal reference files. The earlier Python geocoder is absent from the committed repository; the public export now uses the checked-in Node script.

## Mapping and performance

- US postal codes match the stated state; six-digit ZIP errors are left unresolved rather than silently truncated. Puerto Rico and the U.S. Virgin Islands are territories, not foreign countries or extra states.
- Canadian locations use approximate three-character postal areas, with province validation. These can cover large rural areas. Full street-level geocoding is not implied.
- Switzerland and Bermuda use postal areas; named destinations in the Netherlands, Cayman Islands, Turks and Caicos Islands, Trinidad and Tobago, and Hong Kong match GeoNames cities through explicit source aliases. Country names in the UI are destination labels, not a claim about sovereignty.
- Repeated city/state groups combine order counts and use order-weighted approximate coordinates. Display names preserve source city names (including its spelling). Points are not exact customer premises.
- The internal `points.json` stores `[latitude, longitude, orderCount]` tuples; the public export strips counts. All **3,027 mapped city groups** render in one GPU point batch, loaded with the globe renderer. Public markers have uniform size and animation speed; they do not encode volume.
- `featured.json` limits animated arcs to 20 geographically distributed domestic/territory destinations plus one actual representative per international destination country/territory. The international control shows only the country name and focuses its representative location; it exposes no order totals. These are illustrative connections from the existing approximate origin, not carrier routes, delivery promises, or real-time shipment tracking.
- The SVG fallback marks the same featured destinations without animation. The globe remains transparent and respects reduced motion and offscreen pausing.
- `summary.json` counts all source orders and known states, including unresolved ZIP rows; plotted points include only resolved orders. The report supports all 50 states.

Coordinates are from **GeoNames, CC BY 4.0**, provided without warranty. The shipping page links to GeoNames for attribution. See the [postal readme](https://download.geonames.org/export/zip/readme.txt) and [gazetteer readme](https://download.geonames.org/export/dump/readme.txt).

## Address review

**42,923 orders are mapped; 8 source rows / 9 orders remain unplotted.** They remain included in the source total. No rows are discarded from reconciliation. Correct the source and internal mapping when their intended destinations are confirmed.

| Source address       | Orders | Issue                                 |
| -------------------- | -----: | ------------------------------------- |
| QUEBEC ON H3N1W7     |      2 | Province conflicts with postal prefix |
| Colchester VT 054495 |      1 | Six-digit ZIP                         |
| DEARBORN MI 481201   |      1 | Six-digit ZIP                         |
| Inverness FL 344533  |      1 | Six-digit ZIP                         |
| MIAMI FL 331666      |      1 | Six-digit ZIP                         |
| Port Huron MI 480606 |      1 | Six-digit ZIP                         |
| Saukville WI 530800  |      1 | Six-digit ZIP                         |
| ST GEORGE BB1907     |      1 | Country/locality needs confirmation   |

`review.json` is the generated authority for unresolved rows and original source line numbers. The figures in this document describe the initial supplied report; review them when replacing the report.
