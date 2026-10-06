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
  6. `// $derived$`
  7. `// $effects$`
- Omit empty sections and their comments. Separate sections with a blank line.
- Place imports first, followed by TypeScript type aliases and interfaces, constant declarations, helper functions, the destructured `$props()` declaration, `$derived` / `$derived.by` declarations, and `$effect` / `$effect.pre` calls.
- Within each section, sort declarations alphabetically by their local variable, type, or function name. Sort named import specifiers by their local binding names and import declarations by their first local binding name. Sort destructured props by their local variable names.
- Preserve order when required by dependencies, initialization, side effects, or other runtime behavior. Correctness takes precedence over alphabetical sorting and section ordering. Add a brief comment when a necessary exception is not obvious.
- Keep side-effect-only imports in their required execution order. Effects without declared variable names should remain in a logical order that preserves behavior; do not invent variable names solely to sort them.
- Keep `$state` and other declarations not explicitly covered by these sections in a suitable location based on their dependencies. Do not change `let` to `const` or alter reactive behavior to satisfy formatting.
- Follow the project's formatter for indentation and spacing.

## Sveltewind components

- Never use native HTML tags in Svelte component markup. Use the corresponding Sveltewind components from `sveltewind/components` instead.
- Sveltewind is intended to provide a component for every HTML tag. Verify the available exports and documentation rather than guessing component names.
- If a required HTML primitive is missing, notify the user so it can be added to Sveltewind. The user maintains Sveltewind. Do not silently fall back to native HTML or create a replacement primitive in this project.
- Before creating any project component, check Sveltewind for an existing component that meets the need, including composed components such as Calendar, Popover, and Datatable. Prefer using or composing existing Sveltewind components.
- These markup rules concern rendered HTML elements; Svelte script/style blocks, special Svelte elements, and template directives remain available. The required SvelteKit HTML document shell in `src/app.html` is not Svelte component markup.

## Styling

- Use Tailwind CSS v4 utilities for all project styling, directly on Sveltewind components and the HTML document shell where needed.
- Use responsive, state, arbitrary-value, and arbitrary-selector utilities when needed. Respect reduced-motion preferences with Tailwind variants.
- Do not create custom CSS classes, selector rules, inline styles, or component `<style>` blocks. Do not use `@apply` to recreate custom CSS classes.
- Keep `src/routes/layout.css` limited to Tailwind/Sveltewind imports and Tailwind configuration directives such as `@source`, `@theme`, and `@custom-variant`.

## Completion and commit messages

- After completing each user request, include a suggested Git commit message in the final response.
- Every suggested commit message must start with exactly one of `fix: `, `feat: `, or `refactor: `, followed by a concise description of the completed changes.
- Providing a commit message does not authorize creating a Git commit.

## Project scope

- This repository contains the customer-facing Allen-Bailey Tag & Label website and storefront.
- Company-facing content management and internal administration belong to a separate project.
- Prioritize fast loading, responsive layouts, accessibility, and purposeful animation.
- Do not invent product specifications, certifications, customer endorsements, or company claims.
