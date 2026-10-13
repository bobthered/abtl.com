# About page photography and landscape

The six WebP files in `static/images/about/` are generated placeholders, produced with the built-in imagegen tool on 2026-10-13. They are fictional scenes, not photographs of Allen-Bailey, its staff, equipment, facility, or historic events. Visible captions and alt text identify them accordingly.

## Replacing the photos

Replace these files with approved photographs and update their alt text and the shared StoryPhoto caption. Keep explicit placeholder labels until each replacement is real. StoryPhoto intentionally centralizes the label for this draft; introduce per-image provenance when replacing only some images. Image cropping is controlled by the owning section. Use optimized WebP/AVIF and correct intrinsic dimensions.

- rural-factory-placeholder.webp: current facility / opening landscape.
- workshop-1911-placeholder.webp: genuine early company archive.
- centenary-2011-placeholder.webp: actual centennial photograph if available. The year is derived from the verified 1911 founding, not evidence of the imagined celebration shown.
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
