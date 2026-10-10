# Changelog

Repository history, newest first, grouped by Git author date. Each historical entry identifies an actual commit; these dates are not release dates. No tagged releases existed at the initial audit.

The initial backfill covers all 93 commits reachable from repository refs through `8cea94c` (2025-11-20 to 2026-10-09). The November 2025 work was an earlier prototype, replaced by the October 2026 rewrite. Historical entries include experiments later changed or removed and do not imply that every feature remains active.

## Unreleased

<!-- pending-base: e5c29d623ea12c52d434a8d74e70ed2b33c551a5 -->

Pending commit message (updated across tasks until committed):

```text
feat: add site-wide scroll reveals and shared count-ups

Add a root attachment with subtle fade-and-rise entrances, row staggering, dynamic route/dialog discovery, and reduced-motion cleanup.
Consolidate stock-color and shipping count-ups, preserve live counters, and add browser coverage, usage instructions, and changelog history.
```

## 2026-10-10

- **fix: contain animated bento artwork overflow** (`e5c29d6`)
  Contain scrolling tag columns and preview artwork without losing tile hover expansion. Add mobile, tablet, desktop, and dialog overflow regression coverage and reconcile changelog history.

- **feat: add synthetic materials bento and interactive page** (`bd512cf`)
  Add a wire-tethered tag with wind, rain, hover/focus motion, and reduced-motion support. Build a route-backed dialog and standalone page with a five-material explorer, attachment selector, and full-width sample CTA. Use supplied tag geometry, supplier-informed copy, shared selectable button styling, and browser coverage; update progress and changelog history.

- **refactor: remove placeholder bento topics and document new directions** (`7a09353`)
  Remove shapes, formats, and numbering tiles and their scaffold routes. Update existing dialog/route coverage to retained topics, record competitor-informed proposals, and reconcile the printing commit into changelog history.

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
