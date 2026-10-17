# Changelog

Repository history, newest first, grouped by Git author date. Each historical entry identifies an actual commit; these dates are not release dates. No tagged releases existed at the initial audit.

The initial backfill covers all 93 commits reachable from repository refs through `8cea94c` (2025-11-20 to 2026-10-09). The November 2025 work was an earlier prototype, replaced by the October 2026 rewrite. Historical entries include experiments later changed or removed and do not imply that every feature remains active.

## Unreleased

<!-- pending-base: c5053942e72da5eb036eb16e2d793cbbb491b796 -->

Pending commit message (updated across tasks until committed):

```text
refactor: use native radios for exclusive state choices sitewide

Audit the site's state controls and migrate thirteen exclusive groups across Attachments, stock colors, synthetic materials, variable data, shipping, warehousing, and homepage metrics. Compose Sveltewind Radio and Label in a shared RadioChoice component with checked indicators, visible focus, typed bindings, and independent names for page and dialog instances.

Preserve multi-select controls, independent toggles, and action buttons. Extend automatic scroll reveals and staggering to radio groups and labels, remove the unused selectable-button variant, and update interaction tests for checked state and native keyboard behavior.

Document the audit and validate initial selection, arrow keys, preview updates, responsive layouts, and future unmarked radio content. Reconcile the committed attachment Discuss-link removal in the changelog.
```

## 2026-10-17

- **fix: remove discuss actions from attachment sections** (`c505394`)
  Remove the five section-level Discuss links and unused enquiry URLs from shared Attachments content, and update selection coverage and artwork documentation.

- **fix: show wide material waves in attachment option buttons** (`e8c1b2c`)
  Replace wire, string and elastic selector fastenings with wide horizontal material waves, preserve colors and thicknesses, remove the unused sample finish prop, and update documentation and selection coverage while retaining detailed tag previews.

- **fix: remove patches from attachment option samples** (`bec4f69`)
  Remove patches from wire, string and elastic selection artwork while retaining the main tag previews and dedicated patch sample.

- **fix: correct wired looped and knotted attachment artwork** (`08cce30`)
  Share corrected fastening SVGs across page illustrations, samples and the bento fan, add Looped/Knotted string selection and enquiry details, preserve the 26-gauge steel correction, and document and test the finishing styles and current no-JavaScript route.

- **fix: align attachment preview artwork with the shared tag design** (`73e884f`)
  Use the supplied tag and patch paths with uniform scaling, apply explicit gray-950 print details, share the full-width abstract bento glow, and document and test proportions, theme contrast and responsive backgrounds.

- **feat: add animated attachments to the randomized homepage bento** (`2b95b24`)
  Add an animated attachment fan using shared bento interactions, randomly select six of seven capabilities per homepage request, reuse Attachments content in dialogs and its standalone route, and extend randomization, responsive, motion, navigation and no-JavaScript checks with preview documentation.

- **feat: add original variable-data product artwork** (`0e0966d`)
  Replace application illustrations with original optimized product scenes and shared lightboxes, record generation prompts, add branded artwork to the live format comparison, keep the preview height fixed, and cover image loading, nested lightboxes and desktop/mobile geometry.

## 2026-10-16

- **feat: expand variable-data applications and planning content** (`d0b9f1e`)
  Preserve the supplied tag demo, replace sequence and mailing sections with application cards, an interactive code-format comparison and data preparation guidance, generate matching Code 128 and QR samples, remove unused legacy presentation code, and extend keyboard and responsive coverage.

- **feat: use the supplied tag design for the variable-data demo** (`7ee6565`)
  Preserve the owner-supplied tag geometry and fixed artwork, replace baked values with selectable fields and build-time Data Matrix codes, blend code backgrounds into the stock, and update first-section controls and interaction coverage while retaining the original SVG.

- **refactor: simplify navigation and redirect section roots** (`0f31d4e`)
  Use alphabetized title-only submenu links and animated ActionLabel chevrons, remove desktop and mobile All-section links, and replace four overview pages with server redirects preserving query strings. Remove unused overview copy and cover navigation, capability layouts, and no-JavaScript redirects.

- **fix: balance artwork and copy in wide bento previews** (`63ae157`)
  Add container-aware split compositions for wide portrait previews, retain panoramic artwork, improve print and weather framing, and extend glows, particles, wind and rain across the full tile. Preserve fixed hover canvases, document behavior, add responsive coverage, update globe assertions, and retain the smaller wind slider thumb.

- **refactor: standardize capability pages with a shared content layout** (`9656534`)
  Add ContentLayout and the #lib/layouts entry point, migrate the capabilities overview, attachments and six topic pages to shared title/body/CTA regions, preserve dialogs and controls, alternate full-width body surfaces, and add responsive layout coverage. Retain the footer's explicit surface separator and normal scrolling.

- **fix: remove the homepage brand marquee** (`eb02e8c`)
  Remove the hero marquee, unused content and imports, and obsolete browser tests. Preserve the capabilities bento showcase and restore alternating homepage section backgrounds without a replacement section.

- **fix: animate megamenu sizing without scrollbar flashes** (`a139a31`)
  Start panel height changes alongside incoming slides, fit all seven capability links, clip horizontal travel and enable vertical scrolling only when content exceeds the viewport limit. Preserve keyboard access and reduced motion, and cover transition timing and short-viewport scrolling.

## 2026-10-15

- **feat: add visual attachment comparisons and tailored enquiries** (`c60944e`)
  Replace plain attachment lists with selectable illustrated samples that update tag details and enquiry links. Add a patch close-up, practical selection guidance and stronger section hierarchy, retain confirmed stock options and responsive behavior, remove external comparison references, and extend browser coverage.

- **feat: create detailed attachment capability sections** (`f3b7e18`)
  Add a dedicated attachment capability page with five illustrated sections and owner-confirmed eyelet, wire, string and elastic options. Match capability header sizing, link the new page from navigation and overview pages, remove the synthetic-material attachment section, and cover specifications, responsive sizing and no-JavaScript content.

- **feat: add a continuous wind range to synthetic materials** (`ec7b98d`)
  Replace the wind toggle with a full-width Sveltewind Range and circular primary thumb with contrasting theme rings. Integrate motion phases to avoid reversal and surges, preserve preview and reduced-motion behavior, and add physics and browser regressions. Remove helper copy and simplify the About landscape caption and alt text.

- **fix: use a responsive 12:9 ratio for About timeline images** (`3dcf602`)
  Replace fixed timeline heights with a responsive 4:3 media container, overriding inherited height, minimum-height and flex growth while keeping column widths and lightbox captions.

- **fix: standardize expanding card surfaces and media across the site** (`014363a`)
  Add shared BentoMedia with fixed-size bleed and animated clipping to avoid photo zoom and canvas resize work. Standardize About, stock-color, homepage and news cards, retain foreground gradient outlines and keyboard focus, preserve stock-column loops through resize, and add geometry and reduced-motion coverage with component documentation and project conventions.

- **refactor: require complete descriptive commit message suggestions** (`b33c146`)
  Require complete copyable final commit suggestions with descriptive bodies for multiple changes, and reconcile the committed About image updates into changelog history.

- **feat: restore supplied photos for the About timeline** (`5479c9a`)
  Replace the 1991, 2011, 2018 and Today timeline placeholders with optimized wide derivatives of owner-provided photos. Colorize the hand-finishing image, restore the press operator and safety-celebration photos, apply editorial lighting to the cord-reel detail, and document AI edits, prompts and provenance.

- **feat: add footer landscape artwork and About photo lightboxes** (`86ed801`)
  Add transparent footer landscapes and responsive footer styling with provenance notes. Share LightboxImage across stock-color marquees and About photos, including outline effects, hover zoom, expand icons, preloading and modal behavior; add interaction coverage and milestone captions beneath enlarged timeline images.

- **fix: finalize the connected About timeline and scroll reveals** (`05b89a5`)
  Replace the original timeline grid with the connected alternating layout, animate rich list entries individually through the global attachment, retain shared milestone content and extend reveal regressions.

## 2026-10-14

- **feat: enrich About history with company archive photos** (`92f422e`)
  Expand the company timeline from supplied history pages, preserve source scans and extracted archive crops, add wide AI-extended images and generated 1991/2011 scenes, remove timeline captions, and record image provenance, prompts and browser coverage.

- **feat: add animated chevron labels across site actions** (`7ddc6cf`)
  Add shared ActionLabel with hover/focus chevron-to-arrow motion and reduced-motion support, replace action arrows throughout the site, enlarge hero CTAs, add secondary CTA backdrop blur and refine About CTA styling.

- **feat: refresh About imagery and refine page styling** (`bed8224`)
  Replace the About hero with an optimized owner-provided aerial image, support optional captions, refine neutral-outline buttons and terrain presentation, and add stock-color marquee edge fades. Update image coverage and artwork notes.

- **refactor: move bento topic pages under capabilities** (`4ae681c`)
  Move six topic routes and their components to Capabilities, update links, dialogs, titles, tooling and notes, preserve legacy redirects, make About a direct sorted navigation link, and extend migration coverage.

- **fix: defer scroll reveals until navigation scrolling settles** (`9f20804`)
  Coordinate root navigation with the global reveal attachment and defer viewport/page-end triggers until scrolling and layout settle. Preserve focus and reduced motion, add navigation regression coverage, and wait for hydration in cold-start checks.

- **fix: keep shipping globe land points visible at bento widths** (`2b061da`)
  Use small screen-space land dots to preserve visibility across tile widths. Retain shipment rings and About terrain fades and add rendered-pixel checks in both themes across three widths.

## 2026-10-13

- **fix: strengthen terrain relief and fade points before the map edges** (`0a5d0aa`)
  Increase About terrain elevation exaggeration eightfold and add continuous elliptical fades to both generated point layers. Preserve the Caledonia marker, test rasterized edge transparency, and update artwork notes.

- **fix: move terrain generation out of the application runtime** (`6c43ca1`)
  Move raw terrain data and projection code out of the application graph and generate cacheable SVG masks offline. Preserve theme colors and fading, remove large per-render path construction, and add repeated-request coverage and memory incident notes.

- **fix: soften the Caledonia globe fade and remove rotation controls** (`6999d4b`)
  Fade points geographically before the detailed terrain boundary, preserve separate New York and world colors, remove rotation controls, and update regression coverage and artwork notes.

- **feat: add a New York-focused land globe to the About page** (`36b0c4c`)
  Replace the contour illustration with a spherical point map using real regional elevation and New York boundaries. Center Caledonia, frame New York, color it primary against secondary worldwide land, and add a reproducible generator, attribution and regression coverage.

- **feat: expand the About page with Caledonia roots and company milestones** (`f24e4ca`)
  Build seven story sections, rotating illustrative landscape, four-part timeline, rural setting, capabilities, applications and contact links. Add six labeled generated photo placeholders and replacement notes; extend responsive, no-JavaScript and map interaction coverage.

- **feat: tell Allen-Bailey's story on a dedicated about page** (`7499a1f`)
  Replace the generic About template with researched company history, Caledonia roots, market applications, manufacturing details, and a branded floating-tag illustration. Record primary sources, preserve approved metrics, and add responsive and no-JavaScript coverage.

- **refactor: alphabetize grouped site navigation** (`9eac8c9`)
  Sort submenu sections before direct links, alphabetically within each group. Include Contact in sorted mobile and footer links while retaining its desktop placement, update directional navigation coverage, and reconcile changelog history.

- **fix: simplify mobile header and animate submenu expansion** (`094e8ad`)
  Move mobile Contact and Sign In inside navigation, align submenu trigger sizing with regular links, and slide submenu content open and closed. Reset expanded sections on close and extend mobile navigation coverage.

- **fix: animate mega menu reveal and directional submenu slides** (`9458629`)
  Use Sveltewind subtleReveal for menu entrance and exit, trigger local fly transitions on mounted panels, and preserve outgoing content during directional slides. Add checks for actual animation transforms and reconcile changelog history.

- **feat: add directional mega navigation and submenu pages** (`74d93f4`)
  Move Contact beside Sign In, add a shared desktop mega menu and expandable mobile sections, and put News and Careers last. Add twelve guides, retain six About topic pages, connect overview links, and extend navigation and route coverage.

- **feat: add navigation pages and sign-in placeholder** (`24db416`)
  Add product, market, capability, about, contact, career, and resource pages alongside the existing newsroom. Connect desktop, mobile, and footer navigation; replace header quote and cart controls with a disabled Sign In placeholder. Preserve outlined dialog controls, printing flip-icon changes, and copy simplifications; add route and mobile navigation coverage.

- **refactor: unify product illustration styling and motion** (`1a5b6c7`)
  Share the stock-color gradient surface and gentle floating attachment across stock colors, three synthetic illustrations, and both printing illustrations. Preserve artwork controls, reduced motion, and offscreen pausing; document reuse and add responsive theme coverage.

- **refactor: move bento topic pages under about** (`b9437b8`)
  Move topic routes and private content to /about, updating links, titles, asset scripts, and documentation. Preserve legacy /tags links and aliases with permanent redirects and query parameters; update route coverage and changelog history.

- **fix: extend the metrics background across the section** (`9775fab`)
  Cover the full metrics section with gradient artwork and remove padding below its canvas. Update responsive coverage, preserve outlined shipping destination buttons, and reconcile changelog history.

- **refactor: consolidate Tailwind classes with tailwind-merge** (`e699a6a`)
  Replace class joins and interpolated class lists across shared components, routes, and layouts with twMerge. Add and prebundle the dependency, configure class sorting, document merging rules, and reconcile changelog history.

- **refactor: standardize Svelte markup formatting** (`ddb8d5b`)
  Configure and document clean tag wrapping, reformat routes and components, and preserve inline spacing. Remove an unused shipping value, preserve updated shipping copy, and reconcile changelog history.

## 2026-10-12

- **fix: apply color mode before the first paint** (`72eb3e6`)
  Initialize the saved or system color preference in the document head, remove delayed layout initialization, and preserve storage fallback and favicon updates. Add browser regression coverage and reconcile changelog history.

- **fix: zoom closer for nearby shipping destinations** (`77653d0`)
  Remove the fixed zoom cap so Canada's connection fills the canvas while keeping both endpoints visible. Extend responsive framing tests and reconcile changelog history.

- **fix: fit selected shipping routes within the globe canvas** (`d34b6cf`)
  Restore background destination visibility, keep selected arcs thin at fitted zoom levels, and frame both endpoints and the connecting arc responsively. Preserve smooth and reduced motion, add framing regression tests, and reconcile changelog history.

- **fix: emphasize selected shipping connections** (`d2f267e`)
  Draw a thicker selected arc and brighter origin/destination rings while fading other routes and markers. Avoid recoloring continents when switching destinations and reconcile changelog history.

- **fix: soften shipment markers and zoom the globe on hover** (`de1890b`)
  Add lower-opacity rings with primary-to-secondary halos, smooth tile hover/focus zoom with reduced-motion support, and preserve batched rendering. Hide the preview destination caption and reconcile changelog history.

- **fix: refine the close-up shipping globe artwork** (`b2877f3`)
  Match tile and dialog zoom while retaining a full-width canvas, remove latitude/longitude lines, and render destinations as hollow rings. Generate ten times as many smaller continent dots with fixed noise, preserve batched rendering, and add geometry tests and changelog history.

- **fix: fit the shipping globe and smooth its animation** (`81f73bc`)
  Fill the tile canvas, fit the preview globe, batch routes and markers, remove the frame-skipping limiter, and reduce pixel density. Add responsive sizing coverage, hide shipping map overlays and notes, and reconcile changelog history.

- **fix: keep shipment volumes private and clarify shipping visuals** (`d6b3de1`)
  Remove public order totals and volume-weighted effects, retain internal reference data server-side, export sanitized geography with privacy tests, zoom the globe, and darken light-mode state tiles. Repair the export command and document data privacy and changelog history.

- **feat: map actual order destinations in shipping visuals** (`78ea175`)
  Import actual destination data, add batched volume-weighted markers and bounded animated connections, update international controls and copy, and add reconciliation and route regression coverage. Record coordinate sources and unresolved addresses.

- **refactor: keep theme variants focused on shared styles** (`934fc60`)
  Move one-off layout, control and illustration styling into owning components; remove unused variants and rename shared selection and dialog-close styles. Document variant reuse requirements in AGENTS.md and reconcile changelog history.

- **fix: scale bento gradient orbs with tile width** (`79d8de6`)
  Size backdrop orbs proportionally for one-third, two-thirds and full-width tiles while preserving their centers, subtle opacity and title fade. Reconcile changelog history.

- **fix: soften bento artwork backdrops and improve light-mode contrast** (`69e0492`)
  Add shared blurred gradient orbs with a top fade for shipping, synthetic-materials and printing previews. Remove the globe's solid fill, strengthen light-mode globe and weather details and particle visibility, retain dark-mode particle styling, and reconcile changelog history.

## 2026-10-11

- **fix: stabilize news carousel transitions and use a primary article CTA** (`fb264f3`)
  Hold hover widths while artwork decodes, suppress resizing during focus restoration, and use the primary Read article button. Add delayed-loading regression coverage, tighten transition polling, and reconcile changelog history.

- **fix: smooth news carousel wrapping and highlight the active image** (`0e193ae`)
  Restore the bento outline and expand icon on the active news image. Animate wrapped incoming images during multi-slide selections, decode artwork before movement, preserve hover widths and keyboard focus, and add transition continuity coverage and changelog history.

- **fix: refine news carousel image interactions** (`b0cd070`)
  Replace bento tiles with plain image buttons, keep 2rem hover expansion, and open the route-backed dialog from the active image only. Animate later images to first position without navigation, update article details, and add responsive and keyboard browser coverage.

- **feat: open news highlights in route-backed dialogs** (`a0a2a25`)
  Add bento-style news image tiles with 2rem hover expansion and shallow-route post dialogs. Share post content with standalone articles, preserve dismissal and browser history, and update browser coverage and changelog history.

- **fix: simplify homepage animation controls** (`068e863`)
  Use the shared brand marquee for hover-to-pause and bidirectional dragging. Remove brand and metric canvas pause buttons and the captions and action controls below the canvas, preserving pointer and keyboard interactions. Update browser coverage and changelog history.

- **feat: add shared news highlights and standardize grid spacing** (`85d17d2`)
  Replace the customer spotlight with shared publication data, homepage news highlights, a news listing and article routes. Retain animated golden-ratio image widths and controls above the row; standardize content grids and card collections to 1rem gaps, document publishing conventions and update browser coverage.

- **feat: add golden-ratio customer spotlight carousel** (`8276163`)
  Add a responsive homepage spotlight with five desktop images, animated width transitions, looping chevron controls and keyboard navigation. Use labeled preview stories and local photography pending approved customer content, with reduced-motion support and browser coverage.

- **refactor: colocate page components with their routes** (`77a99b9`)
  Move homepage sections and topic-specific content, helpers and tests beside their owning routes. Retain reusable UI and artwork in the shared component library, move shared topic and stock-color data into lib/data, and update imports, asset scripts and ownership instructions.

- **refactor: deepen abstract particle animations and interactions** (`70495c2`)
  Use primary and secondary points over full-width background glows, with stronger depth fading and a jumbled gathering sphere. Replace flat scenes with a helical current and rotating torus knot, add independent 5-10 second size pulses, and strengthen cursor repulsion in projected screen space. Update responsive coverage and reconcile changelog history.

- **feat: add interactive abstract metric animations** (`74a0c16`)
  Add four selectable abstract point formations sharing 1,200 particles. Gather points into a spring-driven sphere before releasing into the selected scene, including interrupted selections. Add pointer, touch and keyboard interactions, pause and effect controls, theme colors, reduced motion, offscreen rendering suspension and browser coverage. Reconcile changelog history.

- **feat: add animated production metrics section** (`890ba49`)
  Add four confirmed production, shipping, stock color and printing metrics below the bento grid. Animate top and bottom gradient rules that fade to transparent at both ends on hover and keyboard focus, with responsive layouts and reduced-motion support. Reuse global count-ups, add interaction coverage and reconcile changelog history.

- **refactor: remove homepage placeholder sections** (`d58a5a3`)
  Remove industries, products, capabilities and resources sections and their unused content. Keep future navigation labels inactive and direct the hero CTA to the bento grid. Update affected scroll-reveal coverage and reconcile changelog history.

- **feat: adapt scroll stagger timing to group size** (`d26a333`)
  Lengthen the overall entrance wave while shortening individual gaps as groups grow. Stagger control groups automatically and move shipping states into shared SVG group handling, preserving focus, reduced motion and hover behavior. Add browser coverage, document grouping rules and reconcile changelog history.

## 2026-10-10

- **feat: randomize bento topics within fixed layout slots** (`9a29e75`)
  Shuffle topics per page request while preserving SSR hydration, dialog return order and the 2/3, 1/3, 1/3, 1/3, 1/3, 3/3 layout. Decouple widths from topics, adapt QR artwork to narrow tiles and verify every animation at all three widths. Update browser coverage and reconcile changelog history.

- **refactor: discover scroll reveal content automatically** (`2ba8aab`)
  Discover unmarked content, controls, artwork and visual surfaces globally, including dynamic routes and dialogs; preserve grouping, marquee motion and accessibility. Remove page-level entrance opt-ins and add automatic-discovery regression coverage. Update project instructions and reconcile changelog history.

- **fix: complete site-wide scroll animation coverage** (`0bb00a7`)
  Extend automatic reveals to links, buttons, all headings, lists and control groups; reveal artwork, footer groups and stationary marquee wrappers without nested entrances. Audit the homepage and six topic pages/dialogs, including every bottom CTA. Preserve 20% viewport triggers, reduced motion, existing artwork motion and immediate utility-dialog controls. Add route-wide browser coverage and update project instructions and changelog history.

- **fix: make scroll reveals visible at a responsive viewport threshold** (`8529733`)
  Hide client-enhanced pending content and fade it in over 700ms at 80% of viewport height, refreshing the trigger on resize. Preserve staggering and count-ups, expose content for focus, reduced motion and scroll limits, and update browser coverage, instructions and changelog history.

- **feat: add site-wide scroll reveals and shared count-ups** (`720f197`)
  Add a root attachment with subtle fade-and-rise entrances, row staggering, dynamic route/dialog discovery, and reduced-motion cleanup. Consolidate stock-color and shipping count-ups, preserve live counters, and add browser coverage, usage instructions, and changelog history.

- **fix: contain animated bento artwork overflow** (`e5c29d6`)
  Contain scrolling tag columns and preview artwork without losing tile hover expansion. Add mobile, tablet, desktop, and dialog overflow regression coverage and reconcile changelog history.

- **feat: add synthetic materials bento and interactive page** (`bd512cf`)
  Add a wire-tethered tag with wind, rain, hover/focus motion, and reduced-motion support. Build a route-backed dialog and standalone page with a five-material explorer, attachment selector, and full-width sample CTA. Use supplied tag geometry, supplier-informed copy, shared selectable button styling, and browser coverage; update progress and changelog history.

- **refactor: remove placeholder bento topics and document new directions** (`7a09353`)
  Remove shapes, formats, and numbering tiles and their scaffold routes. Update existing dialog/route coverage to retained topics, record creative proposals, and reconcile the printing commit into changelog history.

- **feat: add full-color printing bento and interactive page** (`d519626`)
  Replace the materials tile with a third-width printing tile whose perspective CMYK layers register on hover or focus. Add a route-backed dialog and standalone botanical hangtag design study with ink controls, reversible artwork, eight-color printing copy, and a project CTA. Reuse supplied tag/patch shapes, cache transparent ink artwork, add a dark-mode light backdrop and reduced-motion support, and update browser coverage, process-color tokens, progress documentation, and changelog history.

- **feat: add warehousing bento and interactive release page** (`d85c12a`)
  Add a route-backed warehousing dialog and standalone page with volume-order copy and a planning CTA. Animate isometric stocked shelves and carton releases with hover/focus acceleration and reduced-motion support. Add demo inventory controls, workflow comparisons, responsive layouts, browser coverage, bento progress, and changelog reconciliation.

- **feat: add variable data bento and interactive page** (`43c395f`)
  Replace the printing placeholder with a variable data tile, route-backed dialog, and standalone page. Add transparent QR artwork with 4,000 orbiting particles and hover/focus scanning, interactive codes and numbering, personalized mailing examples, and build-time SVG generation. Preserve former printing links. Remove the hero configurator and saved overrides; finalize zoom 3, floor timing 30s/2s, spread 5/5, and visual thickness scale 10. Update browser coverage, bento progress, and changelog history.

- **feat: add shipping globe and destination page** (`262c233`)
  Add a route-backed shipping topic with a lazy-loaded 3D globe, primary-to-secondary polar gradient, animated demo shipment arcs, and a local geographic fallback. Build a 50-state coverage map, destination explorer, and full-width contact CTA. Record stock colors as complete, isolate demo data for replacement, synchronize dialog dismissal with route history, and add browser coverage and geographic asset tooling.

- **feat: redesign stock color content and sample requests** (`c290cf7`)
  Keep one photo marquee and add an animated color studio with three distinct fronts, reversible artwork, and a color count. Constrain dividers, normalize spacing, and finish with a full-width sample CTA. Add a compact sample picker with select-all, clear-all, and email requests; update shared styles, browser coverage, and changelog history.

- **feat: refresh stock color animation and route** (`2fc26c5`)
  Replace the color tile preview with independently shuffled, looping tag columns, hover/focus acceleration and zoom, a title fade, and reduced-motion support. Retain the original fan preview. Move the color route to `/tags/stock-colors`, redirect the former URL, document the changes, and cover the animation and routing behavior.

- **feat: add route-backed bento dialogs and standalone topic pages** (`b0e15d7`)
  Share topic content across route-backed animated dialogs and standalone pages, with full-width color marquees. Preserve browser history, direct links, new tabs, focus, and SSR-safe page titles. Add routing regression coverage and reconcile the previous changelog entry.

- **feat: add audited changelog and task completion conventions** (`e074134`)
  Backfill all 93 earlier commits with dated summaries and references. Require one pending changelog entry covering all uncommitted work and matching the suggested commit message.

## 2026-10-09

- **fix: dismiss bento dialogs and lightboxes on outside click** (`8cea94c`)
  Add reusable outside-dismiss behavior for bento dialogs and lightboxes, with nested-dialog and drag handling tests.

- **feat: expand stock-color browsing with interactive tiles and lightboxes** (`aeced39`)
  Add reusable BentoItem tiles, inertial draggable marquees, and preloaded image lightboxes. Expand stock-color content, group white/manila, colored stocks, and fluorescents, and add sample requests. Add exact SVG tag composites for every stock color, asset rebuild tooling, clipping/lifecycle fixes, and interaction tests.

- **feat: derive tertiary palette from secondary with a 60-degree hue shift** (`d7a54d4`)
  Derive tertiary colors by shifting secondary hues another 60 degrees.

- **fix: improve footer focus contrast and alternate page section backgrounds** (`46ca895`)
  Alternate homepage section surfaces in light/dark mode and preserve readable footer links with consistent focus outlines.

- **feat: tune brand palette and intensify dark-mode bento highlights** (`8b9aa5a`)
  Tune primary saturation to 60% and lightness to 49%, derive secondary hues from primary, and strengthen dark-mode tile highlights.

- **feat: refine bento layouts and brand-color hover gradients** (`1322b9c`)
  Widen Container at xl, enlarge previews, remove subtitles, allow edge-to-edge tile content, and align focus styling. Add pointer-following primary-to-secondary radial hover highlights.

- **feat: add interactive bento grid with scrolling card dialogs and consistent styling** (`da967e6`)
  Scaffold six animated bento tiles with Skeleton content, consistent radii, expand controls, and scrollable Card dialogs with blurred translucent backdrops and bottom-entry transitions.

- **fix: standardize theme rings, focus outlines, and button variants** (`d6380ac`)
  Use rings for full edges and offset outlines for focus. Replace hero-specific button variants with shared base styling and neutral-outline.

## 2026-10-08

- **fix: extend tag shadow floor to prevent clipping** (`3bd0336`)
  Extend the shadow-receiving floor and lighting bounds to prevent clipped falling-tag shadows.

- **feat: add adjustable X and Y tag drop spread** (`b1a914b`)
  Expose horizontal and vertical spawn spread in the development configurator and add settings tests.

- **feat: add adjustable tag bending stiffness and reduce default thickness scale** (`dca6215`)
  Expose bending stiffness for tuning paper deformation and set default visual thickness scaling to 10x.

- **feat: add cloth tags, dimensional lighting, and steady emission** (`cd20790`)
  Add cloth-like visual deformation, dimensional lighting, steady emission, and pile settling improvements while preserving floor cleanup. Add physics/cadence tests and refine hero text masks.

- **fix: shorten floor removal and safely handle intersecting tags** (`acd83b8`)
  Reduce floor removal to two seconds and handle tags intersecting the floor when it returns.

- **feat: add configurable floor cleanup and softer tag landings** (`695bf6d`)
  Use a 30-second floor release interval and configurable five-second removal period, maintain continuous emission, and soften landings. A later commit shortens the removal period.

- **fix: stabilize tag collisions during spawning, stacking, and cleanup** (`fe79053`)
  Improve collisions during spawning, pile stacking, and cleanup, with regression coverage.

## 2026-10-07

- **feat: add lazily loaded interactive tags with timed floor cleanup** (`542c5f6`)
  Lazy-load the physics scene, highlight hovered tags, and open a front/back viewer on click. Replace the wind-gust experiment with timed floor cleanup.

- **feat: add optimized fixed-size tags with weighted stock and paired overprint artwork** (`4ef1e6d`)
  Keep tags at 2.625 by 5.25 inches. Add exact SVG tag/patch geometry, paired front/back artwork, multiply-style ink overprinting, and 75% white stock weighting. Optimize shared rendering resources and textures.

- **feat: set default tag rain camera zoom to 3** (`a7a5581`)
  Set default tag-rain camera zoom to 3.

- **fix: refine hero sizing, text backgrounds, and tag spawning** (`a3f6690`)
  Size the hero relative to viewport/header height with a content-safe minimum. Replace text blur with padded line backgrounds and move tag spawning above the canvas.

- **feat: refresh hero headline around endless possibilities** (`915c2b6`)
  Center the hero message on endless possibilities.

## 2026-10-06

- **feat: refine hero canvas, gradient blur, marquee layout, and camera controls** (`f2b88bf`)
  Expand the canvas across the hero, move the customer marquee into its own section, add camera zoom controls and gradient text blur, and hide animation on mobile. Later changes replace the blur.

- **feat: add configurable 3D tag animation** (`c55db4c`)
  Add saved development controls for emission, gravity, thickness, and scene settings. Expand colors, visible depth, and persistent piles; stabilize dependency prebundling.

- **feat: refresh hero with production counter and 3D falling tag physics** (`a2a59f3`)
  Replace ribbon/static tag graphics with a production-focused hero, an estimated annual counter based on 90 million tags, and Three.js/Rapier falling-tag physics.

- **refactor: refine site typography, component styling, and header spacing** (`01203de`)
  Refine typography with Inter, component spacing/radii, and responsive header spacing.

- **refactor: replace hero carousel with focused animated hero** (`38f0a9c`)
  Remove carousel autoplay patches and tooling. Introduce focused hero copy, CTAs, ribbon/brand animation, and a production estimate; retain the press animation source.

- **feat: add autoplay hero carousel with three themed slides** (`d2430fa`)
  Add production, custom-design, and industry slides with patched Sveltewind autoplay, looping, manual controls, documentation, and tests. The carousel is removed in the following commit.

- **feat: add animated production hero with solid unwind roll** (`fab29c6`)
  Add an isometric production press animation with pause and reduced-motion support; fix solid unwind-roll geometry. Retain disabled floating tags/controls, halve dark-mode opacity, and require commit suggestions to cover all uncommitted work.

- **fix: distribute floating tags without repeated clusters** (`0726901`)
  Improve floating-tag distribution to prevent repeating clusters and add scene tests.

- **feat: expand floating tag settings ranges tenfol** (`1a67376`)
  Expand floating-tag control ranges tenfold.

- **feat: add live floating tag controls and clip only top corner** (`dc2ecc9`)
  Clip only the top corners and add live controls for tag distance, blur, count, and parallax.

- **feat: add floating tag backgrounds with depth-based parallax** (`ad48991`)
  Add decorative stock-colored tags with depth-dependent size, blur, parallax, perspective, and rotation.

- **feat: add rounded square backgrounds to favicons** (`a71c348`)
  Place favicon monograms in rounded squares with white/red light-mode and gray-950/white dark-mode treatments.

- **feat: add theme-aware AB monogram favicon** (`74a8179`)
  Add SVG AB monogram favicons that adapt to light/dark mode.

- **feat: generate page titles from route paths** (`070077d`)
  Generate titles from reversed route segments plus Allen-Bailey Tag & Label; keep the root title as the company name. Add title tests.

- **fix: use white header and mobile menu backgrounds in light mode** (`6fbadb9`)

- **feat: add ABTL color palettes and use brand blue as primary** (`810d73b`)
  Register ABTL blue/red shade palettes and use brand blue as primary.

- **fix: reduce site logo sizes and remove hero logo** (`24cfa88`)

- **feat: use Logo throughout the site layout and homepage** (`632f336`)

- **refactor: move default logo sizing into the theme** (`fa58914`)

- **feat: add customizable two-color Logo component** (`c623538`)
  Create the two-color brand Logo with Sveltewind base props and independent color overrides.

- **feat: apply primary background and white text to footer** (`405acc3`)

- **feat: add responsive shared site footer** (`05c63ed`)

- **refactor: separate icon exports into #lib/icons** (`1f8548f`)

- **refactor: replace hand-coded UI icons with Lucide components** (`cbcb2ea`)

- **refactor: standardize helpers on arrow functions** (`0fa9d20`)

- **refactor: group reactive state in dedicated Svelte script sections** (`cf936af`)

- **refactor: centralize component imports through #lib/components** (`c667788`)

- **fix: invert capabilities section colors in dark mode** (`295ee95`)

- **fix: restore mobile navigation reveal animation** (`db6329c`)

- **feat: add fullscreen mobile navigation and animated header resizing** (`9db7d17`)
  Fill the viewport with mobile navigation and keep its toggle above the overlay. Animate sticky-header padding from lg:py-10 to py-6 on scroll.

- **feat: add a theme-aware border to the sticky header** (`62d5d70`)
  Add a one-pixel gray-200/light and gray-800/dark separator to the sticky header.

- **refactor: standardize boolean variable names with is prefixes** (`7ca5b13`)

- **refactor: use Sveltewind variants and standard Tailwind utilities** (`c509018`)

- **feat: add custom gray primary secondary and tertiary palettes** (`4cf767b`)

- **feat: add animated Sveltewind popover for mobile navigation** (`935235b`)
  Use Sveltewind Popover and subtleReveal for mobile navigation.

- **refactor: remove theme toggle while preserving automatic theme selection** (`af53073`)

- **feat: add persistent light and dark mode preferences** (`30ed08e`)
  Load saved color-mode preferences or initialize from the system preference, using gray-950 backgrounds and gray-50 text in dark mode.

- **refactor: use Sveltewind containers for shared content widths** (`4d07dd3`)

- **refactor: replace custom CSS with Tailwind v4 utilities** (`e84fb24`)

- **feat: build reference-inspired homepage and responsive shared header** (`46744db`)
  Build the reference-inspired homepage and shared responsive navigation header.

- **refactor: remove Storybook tooling and starter examples** (`8a6133a`)

- **refactor: document Sveltewind component and commit message conventions** (`653fac1`)
  Install/configure Sveltewind and document component-first markup, script organization, and commit-message conventions.

- **feat: initiate sveltekit project** (`262f1ba`)
  Reinitialize for the current SvelteKit 3 rewrite with Svelte 5, Tailwind CSS v4, TypeScript, Vercel tooling, linting, formatting, and browser/testing tools. Replace the original local component/theme prototype; Storybook starters are removed in a later commit.

## 2025-11-21

Earlier prototype history; replaced by the 2026 rewrite.

- **feat: update css theme** (`4459750`)
  Update the original prototype CSS theme.

- **feat: add clickOutside attachment** (`c61aed9`)
  Add the original prototype clickOutside attachment and shared export.

- **feat: update site theme classes** (`e347fab`)

- **feat: add props to components** (`896ff0c`)
  Expand original prototype component props and update theme/snippet conventions.

- **feat: add SVG component** (`b4cc752`)

- **feat: add Span component** (`29b53e9`)

- **feat: add Sheet component** (`62135ef`)

- **feat: add Path component** (`b1464bd`)

- **feat: add Card component** (`adcf9ac`)

## 2025-11-20

- **feat: add portal attachment** (`ca81ac9`)
  Add the original prototype portal attachment and shared export.

- **feat: add @lucide/svelte package** (`e07ea53`)

- **feat: add Div element** (`016af69`)

- **feat: add Button component** (`dff4798`)

- **feat: add Nav component** (`468f023`)

- **feat: add Main component** (`6bd11f6`)

- **feat: add A component** (`f6de1a7`)

- **feat: add Logo component** (`c7d59aa`)

- **feat: update css language setting** (`bdcd91d`)

- **feat: add Container component** (`bcca5bc`)

- **feat: set sans font to Inter** (`a20784f`)

- **feat: add Header component** (`2aaee02`)

- **feat: update theme** (`14ab8b6`)
  Update the original prototype document and CSS theme configuration.

- **feat: add svelte.code-snippet** (`3d4744e`)

- **feat: add motion package** (`a00baa6`)

- **feat: add lib/theme** (`d7d6de7`)
  Add original prototype theme defaults, store, exports, and types.

- **feat: add tailwind-merge package** (`853339b`)

- **feat: make project blank** (`eae706a`)
  Clear the starter route/layout for the company website prototype.

- **feat: update README.md** (`d5f8651`)

- **feat: initialize sveltekit** (`bd3e7a0`)
  Initialize the original SvelteKit 2/Svelte 5 prototype with Tailwind CSS v4, TypeScript, Vercel adapter, linting, formatting, and browser testing dependencies.

- **first commit** (`e75d68d`)
  Create the initial repository README.
