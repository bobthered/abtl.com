<script lang="ts">
	import { type Snippet } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { theme } from '$lib/theme';
	import { portal } from '$lib/attachments';

	type Props = HTMLAttributes<HTMLElement> & {
		children?: Snippet;
		class?: string;
		clientHeight?: number;
		clientWidth?: number;
		element?: HTMLElement | null;
		isVisible?: boolean;
		offsetHeight?: number;
		offsetWidth?: number;
		position?: 'bottom' | 'left' | 'right' | 'top';
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
		offsetHeight = $bindable(0),
		offsetWidth = $bindable(0),
		position = 'right',
		transition: customTransition = (_) => {},
		variants = [],
		...restProps
	}: Props = $props();

	// $derives
	const positionClasses = $derived.by(() => {
		if (position === 'bottom') return 'bottom-0 left-0 w-full';
		if (position === 'left') return 'left-0 top-0 h-full';
		if (position === 'right') return 'right-0 top-0 h-full';
		return 'top-0 left-0 w-full';
	});
</script>

{#if isVisible}
	<div
		{...restProps}
		bind:clientHeight
		bind:clientWidth
		bind:offsetHeight
		bind:offsetWidth
		{@attach portal}
		bind:this={element}
		class={twMerge(
			$theme.Sheet.default,
			positionClasses,
			...variants.map((variant: string) => $theme.Sheet[variant]),
			className
		)}
		transition:customTransition
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
