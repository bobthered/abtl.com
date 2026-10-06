# Sveltewind Carousel autoplay

Sveltewind 4.15.0 does not include autoplay. The local Sveltewind source checkout now
contains the implementation, documentation, and demo. Until that change is published,
`patch-package` applies the same Carousel behavior to the installed package during
`npm install` or `npm ci`.

Added props:

- `isAutoplay`: opt into automatic advancement and a pause/play control.
- `autoplayInterval`: milliseconds between advances (default 7000, minimum 1000).
- `isLooping`: wrap manual and automatic navigation at the ends.
- `isPaused`: bindable user pause state.

Autoplay suspends on hover, keyboard focus, hidden tabs, and outside the viewport.
Reduced motion disables autoplay. Inactive slides are inert. Manual navigation remains
available while paused, and the timer restarts after navigation or suspension.

The site's `HeroCarousel` defaults to an 8000 ms interval. Its local theme leaves other
Carousel instances with the standard Sveltewind appearance.

After upgrading to a Sveltewind release containing this API, remove the versioned patch,
the `patch-package` dependency, and the `postinstall` script if no other patches need it.
Run the hero carousel regression tests after upgrading.
