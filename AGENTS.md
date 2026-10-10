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
- Alternate top-level page section backgrounds in visual order using the shared Section variants: `surface` (`bg-gray-50 dark:bg-gray-950`) first, then `surfaceAlternate` (`bg-white dark:bg-gray-900`), repeating. Count sections rendered by child components, including a separate marquee, in this order; do not count nested content sections, dialogs, or the shared header/footer. Explicit backgrounds such as `contrast` or primary-colored sections may replace a section's assigned surface without restarting the alternation. Keep structural variants background-free where practical, and ensure any text masks or canvas surfaces match their containing section's background. Recheck the sequence when adding, removing, or reordering sections.
- Use `rounded-sm` consistently for rectangular UI surfaces, including buttons, icon controls, cards, tiles, dialogs, popovers, inputs, and image panels. Configure shared radii in the theme and keep component overrides consistent. Reserve `rounded-full` for inherently circular shapes such as radio indicators or avatars; use `rounded-none` only for edges that must sit flush against a viewport or adjoining surface.
- Use Tailwind rings for full component edges. Prefer `inset-ring-1` with the appropriate color token for a border-like edge; use an outer `ring` when the design calls for emphasis outside the component. Rings should not change layout dimensions.
- Reserve outlines for accessible focus indicators, preferably `focus-visible:outline-*` with a suitable outline offset and sufficient contrast in light and dark mode. Preserve inherited focus indicators or provide an equally visible replacement.
- Do not use borders unless an individual-side separator is necessary, such as `border-b` on a header or `border-t` between sections. Border-reset utilities remain allowed when removing inherited borders.
- Name button color variants by their background color family, followed by any style modifier, such as `neutral-outline`. Avoid page-specific button variant names.
- Respect reduced-motion preferences with Tailwind variants.
- Use the root layout's shared `scrollReveal` attachment for subtle, once-per-mount entrance animations. Discover semantic content, text, controls, SVG/canvas artwork, decorative groups, and CSS visual surfaces automatically from rendered DOM in main content, dialogs, and the footer, including dynamically mounted routes and portalled content. New pages must inherit entrances without adding reveal attributes or maintaining page-specific selectors. Reveal outer content groups as units to avoid nested entrances; automatically target stationary marquee wrappers instead of moving tracks or repeated copies. Keep regression coverage for unmarked future content as well as existing routes and dialogs when changing the attachment; routine page edits must not require an entrance audit. `data-scroll-reveal` remains an optional grouping override, never a prerequisite. Use `data-scroll-reveal="off"` only for intentional exceptions, including continuously animated hero artwork, compact utility dialogs with their own entrance, and topic-close controls that must remain immediately usable. Align illustration-specific entrance triggers with the shared viewport inset. The trigger is the element top reaching 80% of viewport height; calculate the 20% inset from viewport height in pixels and refresh it on resize. Keep pending content transparent only after client enhancement, and expose it immediately for keyboard focus, reduced motion, or attachment cleanup.
- Opt static, nonnegative integer metrics into shared count-ups with `data-count-up={target}` on a text-only element. Render the final formatted value for SSR and provide an accessible final value (or use an existing screen-reader description). Do not opt live counters, prices, identifiers, dates, or interactive values into DOM-managed count-ups. Preserve reduced-motion behavior and existing hover transforms.
- Do not create custom CSS classes, selector rules, inline styles, or component `<style>` blocks. Do not use `@apply` to recreate custom CSS classes.
- Keep `src/routes/layout.css` limited to Tailwind/Sveltewind imports and Tailwind configuration directives such as `@source`, `@theme`, and `@custom-variant`.

## Completion and commit messages

- Routine project inspection, file edits, dependency installation, and local development, formatting, build, and test commands are authorized as needed to complete the user's requests. Do not ask for conversational confirmation for these actions; platform-enforced approvals still apply.
- Never create Git commits or run `git push`. The user handles all commits and pushes. Read-only Git commands for reviewing status, history, and diffs are allowed.
- After completing each user request, include a suggested Git commit message in the final response.
- Before suggesting a commit message, review Git status, staged and unstaged diffs, and relevant untracked files. The message must encompass all current uncommitted work, including changes from earlier requests and user edits, rather than only the latest request.
- Use a concise subject that describes the overall change. When multiple changes need explanation, add a commit message body summarizing them so all uncommitted work is represented.
- Every suggested commit message must start with exactly one of `fix: `, `feat: `, or `refactor: `, followed by a concise description of the completed changes.
- Providing a commit message does not authorize creating a Git commit.

## Changelog maintenance

- Maintain the root `CHANGELOG.md` at the end of every task that changes repository files, before providing the final suggested commit message. Advice and read-only tasks do not require a changelog edit.
- Keep exactly one pending entry under `Unreleased`. Its subject and body must match the final suggested commit message and encompass all current uncommitted work, including earlier tasks and user edits. Revise this entry across tasks until the user commits; do not append a separate entry for every prompt.
- Record the full current HEAD hash in an HTML comment immediately under `Unreleased`, using `<!-- pending-base: <full hash> -->`. This is the baseline for detecting commits made by the user between tasks, not a hash assigned to the pending changes.
- Before updating the pending entry, compare its baseline with Git history and review newly committed changes. Reconcile those commits into dated historical entries using their actual subjects, author dates, short hashes, and evidence-backed summaries. If the user changed the suggested message or split the work across commits, reflect the actual commits. Avoid duplicating commits already documented. Then update the baseline to the current HEAD and describe only the remaining uncommitted work in the pending entry.
- Preserve historical entries when pending work is committed. Keep history newest first, grouped by author date, with a reference for each commit. If the baseline is missing or no longer an ancestor of HEAD, reconcile against the recorded commit references instead of assuming all pending work was committed.
- Base summaries on commit messages and diffs. Include relevant untracked files when reviewing pending work. Distinguish historical experiments, removals, and replacements from current functionality; do not invent releases, version numbers, test results, or company claims.
- Include the changelog and instruction changes themselves in the pending summary when relevant. Changelog maintenance does not authorize staging files, creating commits, or pushing; the user commits the changelog together with the associated changes.

## Project scope

- This repository contains the customer-facing Allen-Bailey Tag & Label website and storefront.
- Company-facing content management and internal administration belong to a separate project.
- Prioritize fast loading, responsive layouts, accessibility, and purposeful animation.
- Do not invent product specifications, certifications, customer endorsements, or company claims.
