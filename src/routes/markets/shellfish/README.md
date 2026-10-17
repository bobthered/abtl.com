# Shellfish

Route-owned market page using ContentLayout: title, standard-tag preview, pinfed preview, six-up laser sheet preview, and centered contact CTA. Markets navigation includes Shellfish alphabetically; its root redirect is unchanged.

## Product scope

The owner confirmed standard and pinfed tags, including digger and harvester examples, plus laser-compatible sheets with six tags on an 8.5 x 11 inch sheet. Dealer/shipper is an additional custom-layout concept informed by industry research, not a confirmed stock SKU. The examples are deliberately incomplete artwork, not regulatory forms. Do not describe them as compliant, approved, certified, food-contact safe, or suitable for a specific printer. No material, coating, waterproof performance, individual tag dimensions, hole pitch, specific printer model, minimum order, or turnaround has been confirmed.

## Research

Reviewed October 17, 2026. Primary sources establish the purpose of shellstock identification and distinguish harvest and dealer workflows:

- [FDA National Shellfish Sanitation Program](https://www.fda.gov/food/federal-state-local-tribal-and-territorial-cooperative-human-food-programs/national-shellfish-sanitation-program-nssp) links the current published 2023 Guide. Chapter X discusses dealer identification; field planning draws on the general concepts of harvest location/date, product/quantity, and operator identity.
- [New York DEC shellfish shipper and processor permits](https://dec.ny.gov/things-to-do/saltwater-fishing/marine-permits-licenses/shellfish-shippers-processors-permits) describes digger/shipper and dealer activities and submission of tag artwork.
- [Washington commercial razor clam fishery](https://wdfw.wa.gov/fishing/commercial/razor-clam) documents a digger workflow involving certification tags supplied by buyers. This is context, not a rule generalized across jurisdictions.

Final required wording, field order, construction, and authority review must be established for the customer's location and activity. The preview omits actual certification numbers, dates, quantities, advisories, and retention statements. Reverse artwork reserves space for approved project copy. No external artwork, competitor text, or branding is used.

## Artwork and interaction

ShellfishArtwork reuses the owner-supplied standard tag and patch paths at their original proportions, including an open hole. Original cyan/navy print concepts and pinfed strip geometry remain private to this route. Pinfed rectangles illustrate continuous stock rather than the standard die. The strip has two feed positions one illustrated tag pitch apart, with CSS translation inside a fixed clipped viewport. Feed holes, perforations, and DEMO references are conceptual, not specifications. Only the strip moves; the panel stays fixed. Reduced motion disables its transition.

Shared FlipPreview handles the standard tag front/back motion. RadioChoice provides native radios for example headings and shellfish types. Bounded company/harvest-area inputs update both formats locally; entries are not saved or sent. The shared root reveal attachment handles entrances without route observers. Body surfaces alternate after the title. The final CTA uses the shared contrasting treatment.

Route-local browser coverage exercises mobile/desktop light/dark layouts, personalization across formats, all example choices, keyboard selection, shared flip, real feed displacement, fixed preview dimensions, reduced/normal motion, and visible no-JavaScript defaults.

ShellfishSheet preserves the confirmed US Letter sheet proportion (340:440 artwork units) and renders six live examples. Its two-column/three-row arrangement and dashed tag outlines are illustrative, not an approved cutting template or confirmed individual tag dimensions. No printer model compatibility, downloadable print template, adhesive construction, or perforation specification is implied. The third body section uses surfaceAlternate and leads into the shared contrasting CTA. Browser coverage checks all six records and the sheet ratio.
