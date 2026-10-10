<script lang="ts">
	// Imports
	import { A, Button, Canvas, Div, Span } from '#lib/components';
	import type { ComponentProps } from 'svelte';
	import { Maximize2 } from '#lib/icons';
	import { pointerOutline } from '#lib/attachments';

	// Types
	type Props = ComponentProps<typeof Button> & {
		href?: string;
		isExpandVisible?: boolean;
		isInteractive?: boolean;
		surface?: 'default' | 'neutral';
		title?: string;
	};

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
</script>

{#snippet content()}
	<Span
		variants={['bentoSurface', ...(surface === 'neutral' ? ['bentoSurfaceNeutral'] : [])]}
		data-bento-surface
		aria-hidden="true"
	>
		<Canvas variants={['bentoOutline']} data-bento-outline aria-hidden="true" />
	</Span>
	{#if isExpandVisible}
		<Span
			variants={['button.base', 'button.variant.icon', 'bentoExpand']}
			data-bento-expand
			aria-hidden="true"
		>
			<Span variants={['bentoExpandIcon']}><Maximize2 class="size-5 overflow-visible" /></Span>
		</Span>
	{/if}
	{#if title}
		<Span variants={['bentoCopy']} data-bento-copy>
			<Span class="block text-2xl font-medium tracking-tight">{title}</Span>
		</Span>
	{/if}
	{#if children}{@render children()}{/if}
{/snippet}

{#if isInteractive && href}
	<A
		{...restProps as ComponentProps<typeof A>}
		{href}
		variants={[
			'button.base',
			'button.variant.neutral-tile',
			...(surface === 'neutral' ? ['button.variant.neutral-tile-muted'] : []),
			...variants
		]}
		class={className}
		{@attach pointerOutline}
	>
		{@render content()}
	</A>
{:else if isInteractive}
	<Button
		{...restProps}
		type="button"
		variants={[
			'neutral-tile',
			...(surface === 'neutral' ? ['neutral-tile-muted'] : []),
			...variants
		]}
		class={className}
		{@attach pointerOutline}
	>
		{@render content()}
	</Button>
{:else}
	<Div
		{...restProps as ComponentProps<typeof Div>}
		variants={[
			'button.variant.neutral-tile',
			...(surface === 'neutral' ? ['button.variant.neutral-tile-muted'] : []),
			...variants
		]}
		class={className}
		{@attach pointerOutline}
	>
		{@render content()}
	</Div>
{/if}
