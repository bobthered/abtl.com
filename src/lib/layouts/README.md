# ContentLayout

Import `ContentLayout` from `#lib/layouts`. It standardizes the stock-colors page frame: a surface title section with constrained introduction spacing, a body of route-owned sections, and a full-width contrast call to action with centered, constrained content.

Pass `introduction` and `callToAction` Svelte snippets; provide body sections as children. Use the shared section heading variant for the introduction H1, followed by a max-width description. Body sections own their content and alternate surfaces starting with `surfaceAlternate` after the title's `surface`. The layout does not add a Main landmark; each +page supplies its own.

Use `isStandalone={false}` for the existing homepage topic dialogs: the title stays inside the dialog's container and the closing surface bleeds to the dialog edges. Topic state, controls, and content stay with the owning route. Do not place page content in this layouts directory. Markets and other page families have not been migrated.
