# Stock-color photographic composites

All 21 stock-color images are rebuilt from the original production SVGs. The tag and patch are never drawn by the image generator.

- Tag source: [tag-shape.svg](../../tag-shape.svg), unchanged path and 237 ? 474 viewBox. Its 1:2 viewport represents the supplied 2.625 ? 5.25-inch format. Only the upper corners are clipped.
- Patch source: [tag-patch.svg](../../tag-patch.svg), unchanged path and original brown fill. The patch is translated by (94.1475, 0.057) in tag coordinates, with no independent scaling, so the two original hole centers align.
- Both paths are rasterized together at twice the output tag resolution, then uniformly scaled and rotated in the tabletop plane. Neither perspective distortion nor generated geometry is used.
- Paper grain and gentle directional lighting change RGB values only. Soft contact shadows preserve the cut silhouette and open punched hole. The patch has a subtle paper edge rather than a metal eyelet or thick rim.
- Stock colors are read directly from the Tailwind tokens in layout.css.

## Rebuilding

Run `npm.cmd run images:tags` from the repository root. Sharp is an explicit development dependency; compositing adds no browser JavaScript.

[composites.json](composites.json) maps every stock to its output filename, background plate and in-plane rotation. The script checks complete stock coverage and source viewBoxes before writing all 21 optimized 960 ? 720 WebP files. The existing marquee keeps lazy loading and asynchronous decoding.

## Background plates and provenance

Seven tag-free photographic background plates are retained in [backgrounds](backgrounds), reused across the 21 distinct stock-color composites. They were generated with the built-in imagegen tool on October 9, 2026. [The exact background prompt set](backgrounds/prompts.json) is saved alongside the plates. Originals remain in the imagegen output directory.

These are illustrative composites in working environments, not photographs of actual customers. They replace the earlier whole-image generations, which approximated the cuts and patch. The production geometry now comes directly from the supplied vectors; lighting and screen reproduction still affect perceived stock color.
