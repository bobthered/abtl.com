# LightboxImage

Import from `#lib/components`. Combines BentoItem's pointer-following outline,
expanding surface and animated expand icon with clipped hover/focus image zoom,
hover/focus preloading and ImageLightbox's modal animation and dismissal logic.
Motion respects reduced-motion preferences.

Pass `src`, `alt`, optional `caption`, `width`, `height`, `isPriority`, and
`imageClass` for image sizing. Standard BentoItem props control the outer card,
including `class`, `surface`, accessible labels and duplicate-card `tabindex`.
The optional children snippet supplies noninteractive figure captions.
`onVisibilityChange(isVisible)` lets marquees pause while an image is open.

About's route-owned StoryPhoto supplies its placeholder captions and dimensions;
stock-color examples supply their descriptive captions and neutral card padding.
