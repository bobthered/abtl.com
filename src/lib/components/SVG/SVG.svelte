<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type SVGAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	type Props = SVGAttributes<SVGElement> & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: SVGElement | null;
		isVisible?: boolean;
		transition?: (node: Element, options?: Record<string, any>) => any;
		variants?: string[];
	};
	let {
		children,
		class: className,
		clientHeight = $bindable(0),
		clientWidth = $bindable(0),
		element = $bindable(null),
		isVisible = $bindable(true),
		transition: customTransition = (_) => {},
		variants = [],
		...restProps
	}: Props = $props();
</script>

{#if isVisible}
	<svg
		{...restProps}
		bind:clientHeight
		bind:clientWidth
		bind:this={element}
		class={twMerge(
			$theme.SVG.default,
			...variants.map((variant: string) => $theme.SVG[variant]),
			className
		)}
		transition:customTransition
	>
		{#if children}
			{@render children()}
		{/if}
	</svg>
{/if}
