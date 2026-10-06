<script lang="ts">
	// Imports
	import { bluePaths, redPath } from './paths.js';
	import type { ComponentProps } from 'svelte';
	import { theme as globalTheme } from 'sveltewind/theme';
	import { noopTransition, Path, Svg } from '#lib/components';

	// Types
	type Props = Omit<ComponentProps<typeof Svg>, 'children'> & {
		blueColor?: string;
		redColor?: string;
	};

	// $props()
	let {
		blueColor = 'var(--color-abtl-blue-700, #282D5B)',
		class: className = '',
		element = $bindable(null),
		inTransition,
		isVisible = $bindable(true),
		outTransition,
		redColor = 'var(--color-abtl-red-600, #8A181D)',
		theme = globalTheme,
		transition = [noopTransition, {}],
		variants = [],
		...restProps
	}: Props = $props();

	// $derived
	const classes = $derived(theme.resolve('logo', variants, className));

	// $effects
</script>

<Svg
	viewBox="0 0 24 14"
	fill="none"
	role="img"
	aria-label="Allen-Bailey Tag & Label"
	{...restProps}
	bind:element
	bind:isVisible
	class={classes}
	{inTransition}
	{outTransition}
	{theme}
	{transition}
>
	{#each bluePaths as path (path.d)}
		<Path d={path.d} fill={blueColor} fill-rule={path.fillRule} clip-rule={path.fillRule} {theme} />
	{/each}
	<Path d={redPath} fill={redColor} fill-rule="evenodd" clip-rule="evenodd" {theme} />
</Svg>
