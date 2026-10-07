# Falling tag artwork

Place front SVGs in `fronts/` and back SVGs in `backs/`. The animation includes all SVGs in these directories automatically, including subdirectories.

Use a `viewBox="0 0 237 474"` aligned to `../tag-shape.svg`. Keep the paper/background transparent and convert text to paths. The stock color, clipped outline, punched hole, and raised patches are rendered separately.

Use the same filename for matching fronts and backs, for example `fronts/inspection-record-01.svg` and `backs/inspection-record-01.svg`. If using subdirectories, match the relative path on both sides. Each tag randomly chooses one design pair when it spawns and retains it while falling and resting. If a matching side is missing, that side stays blank; artwork from unrelated designs is never combined.

Stock colors are also chosen at spawn: white has a 75% probability, and the other 20 colors share the remaining 25% (1.25% each). These are probabilities rather than fixed quotas, so a small pile can vary from that split. Adjust `tagColorWeights` in `src/lib/components/TagRain/physics.ts` to change the stock mix.

Back artwork should read normally in the SVG; the renderer handles its orientation so it reads correctly when viewing the reverse of the tag.

Both sides use multiply overprinting: ink darkens the colored stock rather than covering it with an opaque color. SVG opacity controls ink coverage (for example, black at 50% opacity darkens red stock); gray ink also darkens proportionally. Transparent areas and white ink leave the stock unchanged. Yellow over the supplied blue stock produces green; exact colors depend on both ink and stock. This is a visual approximation of overprinting, not a print color proof.

Artwork is rasterized once into a shared GPU texture atlas when the animation initializes. Adding designs does not create a separate texture or draw call for every tag. Only desktop visitors with motion enabled load the artwork with the animation.
