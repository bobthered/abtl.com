<script lang="ts">
	// Imports
	import { A, Button, Canvas, Div, Span } from '#lib/components';
	import type { ComponentProps } from 'svelte';
	import { expansionClass } from './classes';
	import { Maximize2 } from '#lib/icons';
	import { pointerOutline } from '#lib/attachments';
	import { twMerge } from 'tailwind-merge';

	// Types
	type Props = ComponentProps<typeof Button> & {
		href?: string;
		isExpandVisible?: boolean;
		isInteractive?: boolean;
		surface?: 'default' | 'neutral';
		title?: string;
	};

	// consts
	const neutralTileClass =
		'group relative isolate flex h-full min-w-0 flex-col items-stretch justify-between gap-6 overflow-visible rounded-sm bg-transparent p-0 text-left text-gray-950 shadow-none hover:bg-transparent hover:text-gray-950 focus:bg-transparent focus:text-gray-950 motion-safe:focus-visible:outline-offset-8 dark:bg-transparent dark:text-gray-50 dark:hover:bg-transparent dark:hover:text-gray-50 dark:focus:bg-transparent dark:focus:text-gray-50';
	const neutralTileMutedClass =
		'bg-gray-100 hover:bg-gray-100 focus:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-950 dark:focus:bg-gray-950';

	// $props()
	let {
		children,
		class: className = '',
		href,
		isExpandVisible = true,
		isInteractive = true,
		surface = 'default',
		title,
		variants = [],
		...restProps
	}: Props = $props();

	// $derived
	const classes = $derived(
		twMerge(neutralTileClass, surface === 'neutral' ? neutralTileMutedClass : '', className)
	);
</script>

{#snippet content()}
	<Span
		class={twMerge(
			expansionClass,
			'pointer-events-none -z-10 rounded-sm bg-white dark:bg-gray-900',
			...(surface === 'neutral' ? ['bg-gray-100 dark:bg-gray-950'] : [])
		)}
		aria-hidden="true"
	/>
	<Span
		class={twMerge(
			expansionClass,
			'pointer-events-none z-20 rounded-sm inset-ring-1 inset-ring-gray-200 dark:inset-ring-gray-800'
		)}
		data-bento-surface
		aria-hidden="true"
	>
		<Canvas
			class="pointer-events-none absolute inset-0 block h-full w-full text-primary-400 opacity-0 transition-opacity duration-300 [--bento-outline-secondary:var(--color-secondary-400)] group-hover:opacity-60 group-focus-visible:opacity-60 motion-reduce:transition-none dark:text-primary-500 dark:[--bento-outline-secondary:var(--color-secondary-500)] dark:group-hover:opacity-90 dark:group-focus-visible:opacity-90"
			data-bento-outline
			aria-hidden="true"
		/>
	</Span>
	{#if isExpandVisible}
		<Span
			variants={['button.base', 'button.variant.icon']}
			class="pointer-events-none absolute top-4 right-4 z-10 size-11 bg-gray-100 text-gray-700 group-hover:bg-primary-500 group-hover:text-white group-focus-visible:bg-primary-500 group-focus-visible:text-white motion-safe:transition motion-safe:duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:translate-x-1 motion-safe:group-focus-visible:-translate-y-1 sm:top-5 sm:right-5 dark:bg-gray-800 dark:text-gray-200"
			data-bento-expand
			aria-hidden="true"
		>
			<Span
				class="flex items-center justify-center [&_path]:transition-transform [&_path]:duration-300 motion-reduce:[&_path]:transition-none motion-safe:group-hover:[&_path:nth-child(-n+2)]:translate-x-0.25 motion-safe:group-hover:[&_path:nth-child(-n+2)]:-translate-y-0.25 motion-safe:group-focus-visible:[&_path:nth-child(-n+2)]:translate-x-0.25 motion-safe:group-focus-visible:[&_path:nth-child(-n+2)]:-translate-y-0.25 motion-safe:group-hover:[&_path:nth-child(n+3)]:-translate-x-0.25 motion-safe:group-hover:[&_path:nth-child(n+3)]:translate-y-0.25 motion-safe:group-focus-visible:[&_path:nth-child(n+3)]:-translate-x-0.25 motion-safe:group-focus-visible:[&_path:nth-child(n+3)]:translate-y-0.25"
			>
				<Maximize2 class="size-5 overflow-visible" />
			</Span>
		</Span>
	{/if}
	{#if title}
		<Span
			class="relative block pt-4 pr-18 pl-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-x-1 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-x-1 motion-safe:group-focus-visible:-translate-y-1 sm:pt-5 sm:pr-19 sm:pl-5"
			data-bento-copy
		>
			<Span class="block text-2xl font-medium tracking-tight">{title}</Span>
		</Span>
	{/if}
	{#if children}{@render children()}{/if}
{/snippet}

{#if isInteractive && href}
	<A
		{...restProps as ComponentProps<typeof A>}
		{href}
		variants={['button.base', ...variants]}
		class={classes}
		{@attach pointerOutline}
	>
		{@render content()}
	</A>
{:else if isInteractive}
	<Button {...restProps} type="button" {variants} class={classes} {@attach pointerOutline}>
		{@render content()}
	</Button>
{:else}
	<Div
		{...restProps as ComponentProps<typeof Div>}
		{variants}
		class={classes}
		{@attach pointerOutline}
	>
		{@render content()}
	</Div>
{/if}
