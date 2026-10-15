# BentoMedia

Import from `#lib/components` inside a `BentoItem`. Set the resting media dimensions
on `class`; place images or artwork inside with `h-full w-full` as appropriate.
The media is sized once with 4px of bleed, then an animated clip reveals that
bleed over BentoItem's 300ms surface expansion. Neither the image's object-cover
box nor the artwork viewport changes size during hover, preventing apparent zoom
and repeated canvas/ResizeObserver work. The outer layout stays fixed too.

Use `isTopFlush` for media below a card heading, keeping the top edge stationary.
Use `isExpandable={false}` for standalone dialog previews. Reduced motion disables
the clip animation and bleed. The component supplies no extra focus stops or pointer handlers.

`BentoItem` owns the surface, foreground outline, keyboard focus and expand icon.
Photos, homepage previews, news carousel images and news listing cards compose
these shared components instead of implementing their own hover scaling or clips.
