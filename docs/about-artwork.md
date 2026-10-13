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

## Landscape scope

CaledoniaLandscape uses Sveltewind SVG primitives with a small deterministic contour model and an isometric projection. Rotation buttons work with keyboard and pointer input; gentle floating uses the existing reduced-motion/offscreen-aware attachment. No LayerChart or additional dependencies were installed.

The terrain, roads and pin position are illustrative, not surveyed or geographically accurate. Do not present this as actual Caledonia elevation data. A future accurate version should substitute preprocessed public terrain and geographic coordinates for the procedural contour model, keeping the lightweight SVG renderer. The actual street address is separate, verified copy.

## Generation prompt

One contact sheet was generated and mechanically separated into six optimized photo assets with Sharp. Built-in imagegen mode was used, with this prompt:

Create a high quality photographic moodboard as ONE image with exactly SIX equal rectangular photographs in a clean 2-column by 3-row grid, no gutters, no text, no borders. Each tile landscape 3:2. For a rural western New York tag and label manufacturer website. These are explicitly fictional placeholder scenes, no real company branding. Top left: expansive contemporary drone photograph of a small rural factory surrounded by green fields, deciduous trees and a small village, warm morning haze, understated brick industrial building. Top right: imagined 1911 print workshop, antique letterpress, paper rolls, black and white archival photography aesthetic. Middle left: imagined 2011 hundred-year company celebration in a modest factory with a cake and a few workers, candid warm documentary photo, no text or banners. Middle right: contemporary industrial building detail, brick facade and open shipping door, afternoon light, representing a corporate transition milestone. Bottom left: closeup of modern linear printing press, paper web and ink rollers, crisp editorial industrial photograph. Bottom right: wide rural countryside in western New York, gentle mostly flat fields and tree lines, country road, golden hour, beautiful understated cinematic documentary photography. Do not render lettering, logos, labels, or watermarks. No mountains. Natural restrained tones with rich greens, tactile details, authentic rather than glossy corporate aesthetic.
