# Project instructions

## Svelte script formatting

Apply these conventions when creating or editing any `.svelte` file, including component, route, and layout files. Apply them to both instance and module scripts where applicable.

- Use TypeScript for new script blocks: `<script lang="ts">`.
- Organize script contents in the following order, with these comments immediately before each non-empty section:
  1. `// Imports`
  2. `// Types`
  3. `// consts`
  4. `// helpers`
  5. `// $props()`
  6. `// $state`
  7. `// $derived`
  8. `// $effects`
- Omit empty sections and their comments. Separate sections with a blank line.
- Place imports first, followed by TypeScript type aliases and interfaces, constant declarations, helper functions, the destructured `$props()` declaration, `$state` declarations, `$derived` / `$derived.by` declarations, and `$effect` / `$effect.pre` calls.
- Within each section, sort declarations alphabetically by their local variable, type, or function name. Sort named import specifiers by their local binding names and import declarations by their first local binding name. Sort destructured props by their local variable names.
- Preserve order when required by dependencies, initialization, side effects, or other runtime behavior. Correctness takes precedence over alphabetical sorting and section ordering. Add a brief comment when a necessary exception is not obvious.
- Keep side-effect-only imports in their required execution order. Effects without declared variable names should remain in a logical order that preserves behavior; do not invent variable names solely to sort them.
- Put every component-level variable initialized with `$state` or `$state.raw` in the `// $state` section, sorted alphabetically by variable name. Never group these declarations under `// consts`, even if declared with `const`.
- Keep other declarations not explicitly covered by these sections in a suitable location based on their dependencies. Do not change `let` to `const` or alter reactive behavior to satisfy formatting.
- Follow the project's formatter for indentation and spacing.

## Functions

- Use arrow functions for helpers, callbacks, and other function values. Declare named helpers with `const` and keep them in the `// helpers` section in Svelte scripts.
- Use a standard function only when required by behavior or syntax, such as dynamic `this`, `arguments`, constructor usage, generators, overload declarations, or necessary declaration hoisting. Add a brief comment explaining any non-obvious exception.
- Preserve initialization order and runtime behavior when converting functions; arrow functions assigned to `const` are not available before their declaration.

## Boolean naming

- Start every boolean variable name with `is` using camelCase, for example `isMenuVisible` instead of `menuVisible`.
- Apply this convention to local variables, parameters, props, and reactive state or derived values, whether explicitly typed or inferred.
- Preserve names required by external APIs; use an `is`-prefixed local alias when binding their boolean values to project variables.

## Sveltewind components

- Never use native HTML tags in Svelte component markup. Use the corresponding Sveltewind components imported from `#lib/components` instead.
- Import components through `#lib/components`, the shared entry point at `src/lib/components/index.ts`. It re-exports all of `sveltewind/components`; direct imports from `sveltewind/components` belong only in this entry point.
- Place future site-specific components in `src/lib/components` and export them from its `index.ts` so they are available through the same import path.
- Sveltewind is intended to provide a component for every HTML tag. Verify the available exports and documentation rather than guessing component names.
- If a required HTML primitive is missing, notify the user so it can be added to Sveltewind. The user maintains Sveltewind. Do not silently fall back to native HTML or create a replacement primitive in this project.
- Before creating any project component, check Sveltewind for an existing component that meets the need, including composed components such as Calendar, Popover, and Datatable. Prefer using or composing existing Sveltewind components.
- These markup rules concern rendered HTML elements; Svelte script/style blocks, special Svelte elements, and template directives remain available. The required SvelteKit HTML document shell in `src/app.html` is not Svelte component markup.

## Icons

- Use `@lucide/svelte` for UI icons whenever an icon is needed. Import icons through `#lib/icons`, the shared entry point at `src/lib/icons/index.ts`, which re-exports all of `@lucide/svelte`. Direct Lucide imports belong only in this entry point; keep icon exports out of `src/lib/components`.
- Before creating a custom icon, check Lucide for a suitable existing icon. Place any needed site-specific icons in `src/lib/icons` and export them from its `index.ts` so they use the same import path. Use Sveltewind SVG primitives for custom icon markup.
- Replace hand-coded SVG UI icons with the corresponding Lucide component. Keep shared icon styling in the theme where practical, hide decorative icons from assistive technology, and give icon-only controls accessible labels. Custom brand artwork and illustrations are not UI icons.

## Styling

- Use Tailwind CSS v4 utilities for all project styling, directly on Sveltewind components and the HTML document shell where needed.
- Inside sections that need constrained content widths, use Sveltewind's `Container` component. Keep section backgrounds full width and place the width-constrained content inside `Container`; use it for shared header content too. Configure shared container widths through the Sveltewind theme rather than repeating width utilities on `Section`, `Header`, or `Div`.
- Prefer standard Tailwind spacing, sizing, typography, color tokens, and named responsive breakpoints. Use arbitrary values only when no suitable standard utility exists and the requirement justifies it.
- Use Sveltewind's default styles and built-in variants first (for example, Button `ghost` for a transparent button). Reuse component styles through references such as `variants={['button.base', 'button.variant.ghost']}` on `A`.
- Add shared custom variants in `src/lib/theme.ts` for recurring component styles. Keep page-level classes focused on layout and small, necessary overrides rather than restating component styling.
- Respect reduced-motion preferences with Tailwind variants.
- Do not create custom CSS classes, selector rules, inline styles, or component `<style>` blocks. Do not use `@apply` to recreate custom CSS classes.
- Keep `src/routes/layout.css` limited to Tailwind/Sveltewind imports and Tailwind configuration directives such as `@source`, `@theme`, and `@custom-variant`.

## Completion and commit messages

- After completing each user request, include a suggested Git commit message in the final response.
- Before suggesting a commit message, review Git status, staged and unstaged diffs, and relevant untracked files. The message must encompass all current uncommitted work, including changes from earlier requests and user edits, rather than only the latest request.
- Use a concise subject that describes the overall change. When multiple changes need explanation, add a commit message body summarizing them so all uncommitted work is represented.
- Every suggested commit message must start with exactly one of `fix: `, `feat: `, or `refactor: `, followed by a concise description of the completed changes.
- Providing a commit message does not authorize creating a Git commit.

## Project scope

- This repository contains the customer-facing Allen-Bailey Tag & Label website and storefront.
- Company-facing content management and internal administration belong to a separate project.
- Prioritize fast loading, responsive layouts, accessibility, and purposeful animation.
- Do not invent product specifications, certifications, customer endorsements, or company claims.
