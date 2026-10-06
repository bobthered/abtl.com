# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@1.1.0 create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" playwright="demo:no" tailwindcss="plugins:none" enhanced-img sveltekit-adapter="adapter:vercel" experimental="features:async,remoteFunctions" --install npm .
```

## Adding features

Add features to your project with `sv add`:

```sh
npx sv add
```

For example, to add Tailwind CSS:

```sh
npx sv add tailwindcss
```

## Developing

### Sveltewind

UI components are provided by [Sveltewind](https://github.com/sveltewind/sveltewind).
Import them from `#lib/components`, which re-exports Sveltewind components and will include site-specific components, for example:

```svelte
<script lang="ts">
	// Imports
	import { Button } from '#lib/components';
</script>

<Button variants={['primary']}>Request a quote</Button>
```

The website initializes the `minimal` preset through `src/lib/theme.ts`.
Tailwind scans the library through `src/routes/layout.css`, which also loads its color palettes.
Custom gray, primary, secondary, and tertiary palettes are defined with Tailwind v4 `@theme`
tokens in `src/routes/layout.css`. Avoid setting `data-color` on the root HTML element,
because Sveltewind's built-in palettes would override the custom primary and secondary colors.
The root `data-theme` attribute controls dark mode; the layout restores the saved preference
or initializes it from the system preference.
Keep customer-specific theme data out of the shared global theme during server rendering.

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.
