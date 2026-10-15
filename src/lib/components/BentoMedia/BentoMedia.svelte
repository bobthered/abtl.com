<script lang="ts">
	// Imports
	import type { ComponentProps } from 'svelte';
	import { Div } from '#lib/components';
	import { twMerge } from 'tailwind-merge';

	// Types
	type Props = ComponentProps<typeof Div> & {
		isExpandable?: boolean;
		isTopFlush?: boolean;
	};

	// $props()
	let {
		children,
		class: className = '',
		isExpandable = true,
		isTopFlush = false,
		...restProps
	}: Props = $props();
</script>

<Div {...restProps} class={twMerge('relative min-h-0 min-w-0', className)}>
	<Div
		data-bento-media
		class={twMerge(
			'absolute inset-0 overflow-hidden rounded-sm',
			isExpandable
				? 'motion-safe:-inset-1 motion-safe:transition-[clip-path] motion-safe:duration-300 motion-safe:[clip-path:inset(var(--spacing)_round_var(--radius-sm))] motion-safe:group-hover:[clip-path:inset(0_round_var(--radius-sm))] motion-safe:group-focus-visible:[clip-path:inset(0_round_var(--radius-sm))]'
				: '',
			isTopFlush ? 'rounded-t-none motion-safe:top-0' : '',
			isExpandable && isTopFlush
				? 'motion-safe:[clip-path:inset(0_var(--spacing)_var(--spacing)_round_0_0_var(--radius-sm)_var(--radius-sm))] motion-safe:group-hover:[clip-path:inset(0_round_0_0_var(--radius-sm)_var(--radius-sm))] motion-safe:group-focus-visible:[clip-path:inset(0_round_0_0_var(--radius-sm)_var(--radius-sm))]'
				: ''
		)}
	>
		{#if children}{@render children()}{/if}
	</Div>
</Div>
