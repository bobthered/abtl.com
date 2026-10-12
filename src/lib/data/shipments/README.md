# Public shipping geography

These files may be bundled into the customer-facing website. They contain destinations only, with no order counts, country totals, reporting-period statistics, or volume-based visual weights.

- `points.json`: `[latitude, longitude]` pairs for batched destination markers.
- `featured.json`: whitelisted location identifiers, names, countries, states, and approximate coordinates for the limited animated connections and international controls.

Run `npm run shipments:build` to refresh these exports from the processed reference under `src/lib/server/shipments`. Internal counts and address review stay in the server-only directory and must not be imported into shared/client code. Source CSV files must not be copied into static assets or exposed through a public endpoint. Updating the original CSV requires updating its internal mapping first; this export command does not geocode addresses.

The globe uses uniform marker sizes and animation speeds, a closer northern-hemisphere camera, offscreen pausing, and a matching SVG fallback. Connections illustrate reach, not carrier routes or live tracking.

Coordinates: [GeoNames](https://www.geonames.org/), CC BY 4.0. The shipping page provides attribution. Postal-area/city coordinates are approximate, not customer premises.
