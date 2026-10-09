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
