<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAnchorAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	type Props = HTMLAnchorAttributes & {
		children?: Snippet;
		class?: string;
		element?: HTMLAnchorElement | null;
		isVisible?: boolean;
		transition?: (node: Element, options?: Record<string, any>) => any;
		variants?: string[];
	};
	let {
		children,
		class: className,
		element = $bindable(null),
		isVisible = $bindable(true),
		style,
		transition: customTransition = (_) => {},
		variants = [],
		...restProps
	}: Props = $props();
</script>

{#if isVisible}
	<a
		{...restProps}
		bind:this={element}
		class={twMerge(
			$theme.A.default,
			...variants.map((variant: string) => $theme.A[variant]),
			className
		)}
		transition:customTransition
	>
		{#if children}
			{@render children()}
		{/if}
	</a>
{/if}
