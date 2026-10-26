# Merchandise Tags

Route-owned market page using ContentLayout for a title, color section, size section, and centered contact CTA. Body surfaces alternate surfaceAlternate then surface. Markets navigation lists Merchandise Tags alphabetically; the Markets root redirect is unchanged.

The owner confirmed the merchandise/marking/jewelry naming, scalloped shape, knotted string, all 21 stock colors, and numbered sizes #1 through #9. Exact length x width dimensions are stored in `_components/sizes.ts` using the owner's fractional inch values. Material, string length, prices, order quantities, and print specifications remain unspecified.

MerchandiseTag reads the supplied `_components/merchandise-tag.svg` path directly, preserving the scalloped outline and open hole. The color preview uses the #4 proportions. The size preview scales length and width independently from the confirmed dimensions, on a common baseline within a fixed viewport. It is a proportional comparison, not actual physical size on a screen. Shared AttachmentFastening renders knotted white string with its attachment point aligned to the supplied SVG hole center for each size. String length remains illustrative and does not claim a specification.

The color picker reuses ColorSwatch and stockColors from the same library as Stock Colors, including all 21 names/tokens, native radios, round swatches, and contrast-aware checkmarks. A single selected color updates both preview tags. Numbered-size selection uses RadioChoice. The size panel stays fixed as the tag silhouette changes relative scale; the color preview keeps a constant size. CSS color transitions respect reduced motion and the root scrollReveal attachment handles entrances. The previews are blank stock concepts, so no unconfirmed print process or ink treatment is implied.

Route-local browser coverage checks all 21 actual fills, shared selection across previews, nine increasing, dimension-proportional silhouettes without viewport resizing, native keyboard selection, knotted-string rendering, mobile/desktop light/dark layouts, and no-JavaScript defaults.
