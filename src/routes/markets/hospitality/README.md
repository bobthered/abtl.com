# Hospitality

Route-owned market page using `ContentLayout` for the shared title, three alternating body sections, and centered contact invitation. Navigation sorts Hospitality between Fire Suppression and Tree Tags; the Markets root retains its Fire Suppression redirect.

Independent research of printed-product catalogs informed seven application groups: luggage claims, valet, coat checks, lost-and-found, laundry/dry-cleaning service identification, bathrobe/amenity tags, and door hangers. These are custom-project applications, not a verified stock list. Only luggage claim was explicitly named by the owner. Do not invent SKUs, availability, materials, wash resistance, dimensions, prices, or turnaround. Laundry examples organize service information; they do not claim to survive washing or dry cleaning. No electronic/RFID features are represented.

Original SVG concepts use the supplied standard tag and patch paths. The luggage demo uses shared `LuggageClaimTag` geometry from the variable-data example: six matching bag labels and a master claim check. The first label can peel out and the claim stub can separate independently; these illustrate a workflow rather than a production die. Discuss peel-off labels, perforations, attachments, and multipart construction for the customer's actual requirements. Door hangers use an original open-hole silhouette and readable privacy/housekeeping faces through shared `FlipPreview`.

Property name and claim reference are local, length-limited inputs. Matching identifiers persist on all six labels and the claim check when separated, and property identity carries into the other previews. Entries are not stored or sent. Application selection uses a named native RadioChoice group; buttons operate the separation and shared flip. Viewport heights stay fixed across state changes. Reduced motion disables the separation transition and shared flip animation.

Reference imagery was inspected for format only. No external photos, branding, catalog wording, source URLs, or supplier-specific specifications are shipped. Hospitality-specific print artwork and application data remain next to the route; reusable luggage geometry lives in the shared component library.

Browser coverage checks matching live identifiers, actual label and stub movement, fixed viewports, all five application choices, keyboard operation, door faces, light/dark mobile and desktop layouts, no-JavaScript defaults, and navigation destinations.
