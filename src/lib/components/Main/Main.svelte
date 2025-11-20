<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';

	type Props = HTMLAttributes<HTMLElement> & {
		children?: Snippet;
		class?: string;
		element?: HTMLElement | null;
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
	<main
		{...restProps}
		bind:this={element}
		class={twMerge(
			$theme.Main.default,
			...variants.map((variant: string) => $theme.Main[variant]),
			className
		)}
		transition:customTransition
	>
		{#if children}
			{@render children()}
		{/if}
	</main>
{/if}
