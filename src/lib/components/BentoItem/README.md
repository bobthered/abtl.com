# BentoItem

Import from `#lib/components`. Shared tile styling, pointer-following canvas edge,
hover expansion, focus indicator, and optional animated expand icon live here.
Content retains its position as the tile's surface expands.

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
- `surface="neutral"` uses the contrasting neutral surface for dialog cards.
- `children` supplies unpadded content; `class` controls layout and optional padding.
- `variants` extends shared styling; other Button props and attachments are forwarded.
- Give interactive tiles an accessible name and avoid nesting interactive controls.

`ImageLightbox`, also exported from `#lib/components`, accepts `src`, `alt`, optional
`caption`, a bindable `isVisible`, and an optional `origin` DOMRect captured from
the source image. It animates between that rectangle and the enlarged image,
honors reduced motion, and uses Sveltewind's modal Dialog for keyboard focus and
Escape dismissal. The lightbox may open above another modal.
