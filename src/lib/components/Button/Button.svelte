<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLButtonAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	type Props = HTMLButtonAttributes & {
		children?: Snippet;
		class?: string;
		element?: HTMLButtonElement | null;
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
	<button
		{...restProps}
		bind:this={element}
		class={twMerge(
			$theme.Button.default,
			...variants.map((variant: string) => $theme.Button[variant]),
			className
		)}
		transition:customTransition
	>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
