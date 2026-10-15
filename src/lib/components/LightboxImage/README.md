# LightboxImage

Import from `#lib/components`. Combines BentoItem's pointer-following outline,
expanding surface and animated expand icon with BentoMedia's expanding image container,
hover/focus preloading and ImageLightbox's modal animation and dismissal logic.
Images stay at a fixed rendered size while the clip reveals their outer bleed,
so object-cover does not create apparent hover zoom. Motion respects reduced-motion preferences.

Pass `src`, `alt`, optional `caption`, `width`, `height`, `isPriority`, and
`imageClass` for the resting media container's sizing. Standard BentoItem props control the outer card,
including `class`, `surface`, accessible labels and duplicate-card `tabindex`.
The optional children snippet supplies noninteractive figure captions.
`onVisibilityChange(isVisible)` lets marquees pause while an image is open.

About's route-owned StoryPhoto supplies its placeholder captions and dimensions;
stock-color examples supply their descriptive captions and neutral card padding.
