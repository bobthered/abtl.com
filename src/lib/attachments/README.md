# Attachments

Import reusable DOM behaviors from `#lib/attachments` and apply them with Svelte 5's `{@attach ...}` syntax. Sveltewind primitives forward attachments to their rendered element.

## dragScroll

`dragScroll(options)` adds horizontal mouse, pen, and touch dragging with release momentum. With no position adapter it uses the attached element's native `scrollLeft`. For a transform-driven track or infinite loop, provide `getPosition` and `setPosition` in logical scroll pixels; positive positions move the content left. The consumer handles wrapping or clamping.

```svelte
<script lang="ts">
	// Imports
	import { Div } from '#lib/components';
	import { dragScroll } from '#lib/attachments';
</script>

<Div {@attach dragScroll()} class="flex touch-pan-y overflow-x-auto select-none">
	<!-- Render horizontally arranged content here. -->
</Div>
```

- Use `touch-pan-y select-none` so vertical gestures retain native page scrolling. Set grab/grabbing cursor utilities in the consumer if desired.
- `onStart` can pause other motion; `onDragChange` reports active dragging; `onInteractionChange` stays active through the release momentum so autoplay can wait until it ends.
- `isEnabled` and `isInertiaEnabled` accept getters, allowing consumers to consult current state without recreating the attachment. Position and callback options can likewise close over current state.
- Momentum uses recent horizontal velocity and exponential decay. It applies to mouse and touch because custom dragging does not invoke native OS scrolling. It stops on a new grab, keyboard input, cancellation, lost window focus, a hidden document, or detach. Reduced-motion preferences disable momentum while retaining manual dragging.
- A tap retains its click. A drag suppresses its resulting pointer click. Keyboard activation stays available.
- The attachment removes its listeners, cancels momentum, and releases pointer capture on cleanup. It does not add CSS, transform styles, or markup.

## Scroll-reveal startup

`src/app.html` stages the first server-rendered paint before page styles and content appear. Its head script sets `data-scroll-reveal-boot="pending"` only when JavaScript runs and reduced motion is disabled. Tailwind utilities on the document shell temporarily make `main` and the footer transparent without changing layout or hiding the header.

`scrollReveal` registers its automatically discovered targets and pending states synchronously, then dispatches `scroll-reveal-ready`. The head script removes the staging gate immediately; only the prepared content units remain transparent until their usual viewport entrances. The document containers themselves do not animate.

The bootstrap releases on keyboard focus, a switch to reduced motion, or an 1800ms startup timeout. Without JavaScript, the flag is never set and SSR content is visible. If a delayed bundle starts after release, the attachment marks already-visible initial content complete instead of hiding it again. Below-fold content and subsequently mounted routes/dialogs continue to use the shared observer, automatic grouping, and adaptive staggering.

Keep this handoff global. Do not add route-specific reveal attributes, duplicate observers, or permanently hidden SSR markup. Cleanup still exposes pending targets, stops active animations, and restores final count values. The trigger remains the element top reaching 80% of viewport height, with the inset computed from viewport height in pixels.

`src/reveal-startup.e2e.ts` delays client scripts and records frame opacity to cover the initial handoff, fail-open paths, and late hydration in both development and generated production bundles. Existing reveal regressions cover no-JavaScript content, viewport thresholds, focus, dynamic content, dialogs, staggering, and navigation.
