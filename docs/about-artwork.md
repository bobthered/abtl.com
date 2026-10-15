# About page photography and landscape

The six original `*-placeholder.webp` files in `static/images/about/` are generated placeholders, produced with the built-in imagegen tool on 2026-10-13. They are fictional scenes, not photographs of Allen-Bailey, its staff, equipment, facility, or historic events. Alt text identifies them accordingly; visible captions remain outside the timeline.

## Owner-provided opening image

The opening About image now uses `golden-hour-industrial-complex-aerial.webp`, converted from the owner-provided `Golden-Hour Industrial Complex Aerial.png` at 1200 x 533, WebP quality 85, to match the previous hero asset. The source PNG is retained. Its alt text describes what is visible without claiming provenance or a verified facility identity. The generic generated-placeholder caption is suppressed for this supplied image; other placeholders retain their provenance in alt text, with visible labels outside the timeline.

## Extracted company archive

Four original archival assets were extracted from the owner-provided root files `IMG_2260.jpg` and `IMG_2261.jpg`. They contain the wooden nursery tag, horse-drawn wagon, industry handshake, and company gathering reproduced in the centennial history. The sources remain untouched and outside the public static directory.

Run `node scripts/extract-about-archive.mjs` to reproduce the crops. The script respects EXIF rotation, corrects each image's four-corner page perspective with bilinear sampling, exports WebP quality 88, and strips camera metadata. It does not generate or invent image detail, reconstruct missing areas, or identify undated people/events. Printed halftone, page curvature and photographic softness remain. Combined output is approximately 258 KB.

The original crops remain available for comparison. The timeline now uses wider AI-extended derivatives with `object-cover`, correct intrinsic dimensions and no visible caption strips, as requested. The dated timeline text does **not** date its accompanying archival photograph. The wooden tag is an example shown in the booklet, not a verified surviving object from 1911. The gathering is not identified as the 2011 anniversary. Other fictional photos outside the timeline keep their generated-placeholder labels. Timeline provenance remains explicit in image alt text and these notes. See [history source notes](about-history-sources.md).

## Wide timeline images (2026-10-14)

The built-in imagegen tool edited each original archive crop separately into a wide landscape composition. These are AI-extended derivatives, not unaltered historical prints: generated surroundings and incidental details must not be treated as historical evidence. The original JPEG pages and deterministic WebP crops are retained. New fictional 1991 manufacturing and 2011 centennial still-life images fill the previously text-only milestones; they do not document the actual acquisition, facility, people or anniversary event.

All six new assets are optimized at 1200 x 667, WebP quality 85, under `static/images/about/`:

- `archive-wooden-nursery-tag-wide.webp`
- `archive-horse-drawn-tag-wagon-wide.webp`
- `archive-industry-handshake-wide.webp`
- `archive-company-gathering-wide.webp`
- `industrial-tags-1991-generated.webp`
- `centenary-2011-generated.webp`

All eight timeline cards suppress visible captions and use `object-cover`. Alt text identifies AI-extended archive images or generated illustrations. Existing 2018 and Today placeholder images remain generated. The complete final prompt for each of the six new images is stored in [about-image-prompts.json](about-image-prompts.json); execution used the built-in tool, not the API/CLI fallback. The extraction script regenerates original crops only, not AI extensions.

## Restored hand-finishing archive photo (2026-10-15)

The 1991 milestone now uses `archive-hand-finishing-color-wide.webp` from the owner-provided root `IMG_2263.jpg`, replacing the fictional `industrial-tags-1991-generated.webp` workbench (retained as an unused earlier asset). The original JPEG remains unchanged. The built-in imagegen tool removed page margins and captions, corrected perspective, reduced printed halftone artifacts, colorized the worker and workshop, and extended the surroundings to a wide landscape composition. Sharp exported the selected result at 1200 x 667, WebP quality 85, matching the other wide archive assets.

This is an AI-restored, colorized and extended derivative. Colors and reconstructed surroundings are interpretive; the original photograph's date is unverified, and its use beside 1991 does not date it or document that acquisition. Alt text records these limits. The image uses the shared lightbox and the existing milestone caption. The exact prompt is in [about-hand-finishing-restoration.json](about-hand-finishing-restoration.json).

## Restored press operator archive photo (2026-10-15)

The 2011 milestone now uses `archive-press-operator-wide.webp` from the owner-provided root `IMG_2265.jpg`, replacing the fictional `centenary-2011-generated.webp` cake and album scene (retained as an unused earlier asset). The original JPEG remains unchanged. The built-in imagegen tool removed paper margins, corrected perspective, reduced print artifacts, restored contrast and existing color, and extended the workshop to either side. Sharp center-cropped the extended result to 1200 x 667 and exported WebP quality 85, matching the wide timeline assets.

The worker and main press remain in the composition. This is an AI-restored and extended derivative, not an untouched historical photograph. The original photo date is unverified; its use beside 2011 does not date it or identify a centennial event. Alt text records this provenance. It retains the shared lightbox and the existing 2011 milestone caption. The exact prompt is in [about-press-operator-restoration.json](about-press-operator-restoration.json).

## Safety celebration group photo (2026-10-15)

The 2018 milestone now uses `safety-celebration-wide.webp` from the owner-provided `IMG_6387.jpg`, replacing the fictional `ennis-2018-placeholder.webp` building (retained as an unused asset). The built-in imagegen tool cleaned compression artifacts, improved color and contrast, and extended the lawn and surroundings to a wide composition. The selected output preserves the sign's 730 Day badge; an earlier output with altered digits was rejected. Sharp exported the final image at 1200 x 667, WebP quality 85. The source JPEG remains unchanged.

This is an AI-cleaned and extended derivative, not untouched documentary evidence. The supplied photo depicts a safety celebration; its date is unverified and placement beside 2018 does not identify it as an acquisition event. Alt text records the provenance. It uses the existing shared lightbox and milestone caption. The exact selected prompt is in [about-safety-celebration-restoration.json](about-safety-celebration-restoration.json).

## Editorial cord reel detail (2026-10-15)

The Today timeline milestone now uses `tag-cord-reel-editorial-wide.webp` from the owner-provided `IMG_2266.jpg`, replacing the generated printing-press placeholder in the timeline only. The separate About section continues to use that earlier placeholder. The unchanged original is a photographed book page showing an orange cord reel, yellow guide pulley and white strung tags on a blue-edged workbench.

At the owner's request, the built-in imagegen tool removed page margins and print artifacts, corrected perspective, extended the workbench and workshop, and applied a premium product-photography treatment with directional lighting, controlled highlights, richer color and selective focus. This is an AI-enhanced editorial derivative with reconstructed surroundings and lighting, not an untouched contemporary facility photograph. No equipment date or current installation is inferred from its Today placement. Alt text identifies the edit. Sharp center-cropped the wide output and exported 1200 x 667 WebP quality 85. The exact prompt is in [about-cord-reel-editorial.json](about-cord-reel-editorial.json).

## Replacing the photos

Replace these files with approved photographs and update their alt text and the shared StoryPhoto caption. Keep alt text and project notes accurate when replacing images. Timeline captions are intentionally hidden; StoryPhoto retains optional visible captions for other sections. Image cropping is controlled by the owning section. Use optimized WebP/AVIF and correct intrinsic dimensions.

- rural-factory-placeholder.webp: current facility / opening landscape.
- workshop-1911-placeholder.webp: retained unused experiment, replaced by supplied archival material.
- centenary-2011-placeholder.webp: retained unused experiment; the timeline no longer presents an imagined anniversary event.
- ennis-2018-placeholder.webp: approved acquisition-era photo or facility image. Acquisition date comes from the cited Ennis annual report in about.ts.
- press-today-placeholder.webp: current production/team (currently used twice).
- rural-landscape-placeholder.webp: actual Caledonia-area countryside.

## New York-focused land globe

CaledoniaLandscape projects the Earth's land onto a sphere, zoomed to New York with Caledonia as its center. Approximately 16,000 New York points use primary; surrounding and worldwide land uses secondary. Batched SVG paths separate colors and distance opacity. Offscreen points and the far hemisphere are culled. Opacity follows great-circle distance from Caledonia, with a smoothstep fade reaching zero at 550 km, before the rectangular detailed-data boundary. There are 32 opacity levels per color to keep point rendering batched. A continuous elliptical mask additionally fades the static point layers to zero 16 SVG units inside all four viewport edges. The Caledonia marker and text are outside this mask. It uses our Sveltewind SVG primitives, with the shipping globe's primary-600/secondary-600 light palette and primary-400/secondary-400 dark palette. No additional dependencies or LayerChart.

Caledonia village center (-77.8528, 42.9731) is the projection origin and remains at the exact viewport center. This is the village location, not a surveyed facility location. Vertical elevation is exaggerated 240x (eight times the previous relief scale) for legibility; geographic point positions have deterministic bounded jitter, not randomly invented terrain heights. The gentle float attachment respects reduced motion, page visibility and offscreen pausing.

Regenerate source data and assets with `node scripts/build-new-york-terrain.mjs`. To redraw from existing data without downloads, run `node scripts/render-new-york-terrain.mjs` (Node 22.18+ supports its TypeScript helper). Raw data and projection helpers live under `scripts/data` and `scripts/lib`, outside the application import graph. The page references two pre-generated white SVG point layers as external masks, colored by existing Tailwind theme utilities. Vite/SSR never imports the raw dataset, constructs point arrays, or regenerates long paths. This also removes megabytes of geometry from each HTML response and hydration payload. The SVG files are independently cacheable static resources; no map-service requests are made at runtime. The generator clips state boundaries against land and lakes, samples zoom-8 Terrarium tiles, and validates count and high-elevation coverage before writing. Elevation is sampled at raster resolution rather than a ground survey. Circles are batched into up to 64 color/distance-opacity paths; there is no animation-frame geometry rebuild or WebGL context. The fixed view fits New York while preserving Caledonia's centered location. Rotation controls were removed at the owner's request. Surrounding regional elevation is sampled over longitude -85 to -68, latitude 38 to 48; distant worldwide land uses the sea-level sphere, not fabricated elevation. Worldwide coarse samples reuse the shipping globe's local Natural Earth land asset with deterministic jitter.

Sources accessed 2026-10-13:

- [New York State GIS civil boundaries](https://gis.ny.gov/civil-boundaries), generalized at 0.005 degrees through the public FeatureServer.
- [Mapzen Terrain Tiles on AWS](https://registry.opendata.aws/terrain-tiles/), USGS elevation data. [Encoding](https://github.com/tilezen/joerd/blob/master/docs/formats.md): elevation in meters = R * 256 + G + B / 256 - 32768.
- [Terrain attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md): USGS 3DEP and global GMTED2010/SRTM data courtesy of the U.S. Geological Survey. Heights are modified only by visual exaggeration in the renderer.
- [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) public-domain 1:10m land and lake masks.
- [GeoNames Caledonia](https://www.geonames.org/5111073/caledonia.html), village coordinates, [CC BY 4.0](https://www.geonames.org/about.html).

## Generation prompt

One contact sheet was generated and mechanically separated into six optimized photo assets with Sharp. Built-in imagegen mode was used, with this prompt:

Create a high quality photographic moodboard as ONE image with exactly SIX equal rectangular photographs in a clean 2-column by 3-row grid, no gutters, no text, no borders. Each tile landscape 3:2. For a rural western New York tag and label manufacturer website. These are explicitly fictional placeholder scenes, no real company branding. Top left: expansive contemporary drone photograph of a small rural factory surrounded by green fields, deciduous trees and a small village, warm morning haze, understated brick industrial building. Top right: imagined 1911 print workshop, antique letterpress, paper rolls, black and white archival photography aesthetic. Middle left: imagined 2011 hundred-year company celebration in a modest factory with a cake and a few workers, candid warm documentary photo, no text or banners. Middle right: contemporary industrial building detail, brick facade and open shipping door, afternoon light, representing a corporate transition milestone. Bottom left: closeup of modern linear printing press, paper web and ink rollers, crisp editorial industrial photograph. Bottom right: wide rural countryside in western New York, gentle mostly flat fields and tree lines, country road, golden hour, beautiful understated cinematic documentary photography. Do not render lettering, logos, labels, or watermarks. No mountains. Natural restrained tones with rich greens, tactile details, authentic rather than glossy corporate aesthetic.

## Memory incident (2026-10-13)

The owner reported a Node heap exhaustion near 4 GB. The log showed roughly 620 million milliseconds (over seven days) of process uptime and did not identify an allocating module or prove the terrain was the leak. The previous implementation did import a large JSON module into Vite and construct about 2.25 MB of SVG path strings per component render. Those avoidable costs are removed by offline SVG generation. A short request regression cannot establish that all long-running Vite/HMR leaks are resolved. Restart a crashed development server normally; investigate with a heap profile if sustained growth returns. No permanent heap-limit increase was added.
