# BentoItem

Import from `#lib/components`. Shared tile styling, pointer-following canvas edge,
hover expansion, focus indicator, and optional animated expand icon live here.
Text retains its position as the tile's surface expands. Compose `BentoMedia` for
images or artwork that fill the expanding surface without transform-based zoom.
Both components share inset geometry and timing. The outline sits above media,
and keyboard focus draws the gradient at the upper-right edge.

```svelte
<BentoItem title="Explore our options" aria-haspopup="dialog" onclick={openDialog}>
	{@render preview()}
</BentoItem>

<BentoItem isInteractive={false} isExpandVisible={false} surface="neutral" class="p-6">
	{@render colorSample()}
</BentoItem>
```

- `href` renders a real Sveltewind link when interactive; supports new tabs and normal browser navigation.
- `isInteractive` defaults to `true`: renders a Sveltewind Button; `false` renders Div.
- `isExpandVisible` defaults to `true` and controls the decorative expand indicator.
- `title` is optional. It uses the shared inset and hover translation.
- `isResponsivePreview` opts a portrait-style preview into a named container query: at 36rem of actual tile width, copy and artwork become a 2:3 split. Narrow tiles stay stacked. `description` appears only in the split layout. Use this for single-subject artwork; panoramic compositions can keep the normal layout. Changes respond to layout width, never hover. In split mode, BentoPreview keeps its clipped viewport and decorative effects across the full tile, with only the subject constrained to the right column. Copy sits above this background layer.
- `surface="neutral"` uses the contrasting neutral surface for dialog cards.
- `children` supplies unpadded content; `class` controls layout and optional padding.
- `variants` extends shared styling; other Button props and attachments are forwarded.
- Give interactive tiles an accessible name and avoid nesting interactive controls.

`ImageLightbox`, also exported from `#lib/components`, accepts `src`, `alt`, optional
`caption`, a bindable `isVisible`, and an optional `origin` DOMRect captured from
the source image. It animates between that rectangle and the enlarged image,
honors reduced motion, and uses Sveltewind's modal Dialog for keyboard focus and
Escape dismissal. The lightbox may open above another modal.
