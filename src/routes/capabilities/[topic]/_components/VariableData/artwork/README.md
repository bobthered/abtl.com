# Variable-data tag artwork

`ticket-template.svg` preserves the shape, 180 x 648 viewBox, stock color, reinforcement, dividers, fixed labels, and gratuity notice from the owner-supplied root `variable-data-example.svg`. The first 61 direct paths form the fixed template. The remaining outlined numbers and all embedded Data Matrix image, mask, and definition groups were removed rather than covered up.

`VariableDataTag.svelte` adds live names, piece counts, numbers, references, and generated Data Matrix images at the original field positions. Each selected sample has six numbered sections and one master stub. Sample names are fictional.

Run `npm run images:variable-ticket` after changing `ticketExamples.json`. The build script uses bwip-js to generate ECC 200 Data Matrix SVGs encoding `number/reference-piece` for each section and `number/reference` for the master stub. Code 128 and QR SVGs encode the same master reference for the format comparison. No barcode encoder is loaded in the browser. Keep the root original as the design reference.

The shared `LuggageClaimTag` component now owns the six-label/header/stub clipping layout and optional separation motion. `VariableDataTag` passes the unchanged printed template and original field/code positions into its snippets. Hospitality reuses that layout with its own printed concept artwork and matching text references.
