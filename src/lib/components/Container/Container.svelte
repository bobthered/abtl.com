<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		class?: string;
		element?: HTMLDivElement | null;
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
	<div
		{...restProps}
		bind:this={element}
		class={twMerge(
			$theme.Container.default,
			...variants.map((variant: string) => $theme.Container[variant]),
			className
		)}
		transition:customTransition
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
