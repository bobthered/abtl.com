# FlipPreview

Shared two-sided product preview and bottom-centered flip action, extracted from the full-color printing interaction for use with canvas or SVG artwork. Pass an `artwork(isBack)` snippet and optionally bind `isBack` for surrounding captions. Both sides remain mounted so artwork is ready before it rotates into view; the reverse gets its own half-turn so its print reads normally. Inactive content is inert and hidden from assistive technology.

The fixed viewport uses perspective, a preserved 3D rotor, hidden backfaces, and a 700ms ease-out rotation. CSS handles interrupted/reversed transitions continuously. Reduced motion removes the transition; without JavaScript the initial face remains visible. The control stays outside the rotating/floating surface and retains keyboard focus.

Use `viewportClass` for a fixed standalone viewport or let the default flex viewport fill a constrained parent. `class` customizes the outer layout, and `buttonAttributes` preserves route-specific test hooks. All class overrides merge through `twMerge`.

The printing canvas now renders a fixed side and keeps its ink-registration animation. It measures untransformed layout dimensions so rotation cannot trigger an apparent canvas resize. The shared component exclusively owns duplex motion in full-color printing and Fire Suppression; do not add a second flip inside those renderers.
