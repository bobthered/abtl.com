<script lang="ts">
	// Imports
	import { BentoItem, BentoMedia, Figure, ImageLightbox, Img } from '#lib/components';
	import type { ComponentProps, Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { untrack } from 'svelte';

	// Types
	type Props = Omit<
		ComponentProps<typeof BentoItem>,
		'children' | 'onclick' | 'onfocusin' | 'onpointerenter'
	> & {
		alt: string;
		caption?: string | null;
		children?: Snippet;
		height?: number;
		imageClass?: string;
		isPriority?: boolean;
		onVisibilityChange?: (isVisible: boolean) => void;
		src: string;
		width?: number;
	};
	type Selection = { isVisible: boolean; origin: DOMRect };

	// helpers
	const openImage = (event: MouseEvent) => {
		const image = (event.currentTarget as HTMLElement).querySelector('img');
		if (!image) return;
		preloadImage();
		// Each opening owns its visibility so an older outro cannot close a newer selection.
		selection = { isVisible: true, origin: image.getBoundingClientRect() };
	};
	const preloadImage = () => {
		if (preloadedSrc === src) return;
		const image = new Image();
		image.decoding = 'async';
		image.src = src;
		preloadedSrc = src;
		void image.decode().catch(() => {
			if (preloadedSrc === image.getAttribute('src')) preloadedSrc = undefined;
		});
	};

	// $props()
	let {
		alt,
		caption,
		children,
		class: className = '',
		height = 720,
		imageClass = '',
		isPriority = false,
		onVisibilityChange,
		src,
		width = 960,
		...restProps
	}: Props = $props();

	// $state
	let preloadedSrc = $state<string>();
	let selection = $state<Selection | null>(null);

	// $effects
	$effect(() => {
		const isVisible = selection?.isVisible ?? false;
		// Consumer state reads must not subscribe every marquee copy to the active selection.
		untrack(() => onVisibilityChange?.(isVisible));
	});
</script>

<BentoItem
	aria-label={`Enlarge image: ${alt}`}
	{...restProps}
	aria-haspopup="dialog"
	class={twMerge('w-full cursor-zoom-in', className)}
	onclick={openImage}
	onfocusin={preloadImage}
	onpointerenter={preloadImage}
>
	<Figure class="relative m-0 flex h-full min-h-0 w-full flex-col gap-6">
		<BentoMedia class={twMerge('h-full w-full flex-1', imageClass)}>
			<Img
				{src}
				{alt}
				{width}
				{height}
				loading={isPriority ? 'eager' : 'lazy'}
				fetchpriority={isPriority ? 'high' : 'auto'}
				decoding="async"
				class="h-full w-full object-cover"
			/>
		</BentoMedia>
		{#if children}{@render children()}{/if}
	</Figure>
</BentoItem>

{#each selection ? [selection] : [] as selected (selected)}
	<ImageLightbox
		bind:isVisible={selected.isVisible}
		origin={selected.origin}
		{src}
		{alt}
		caption={caption ?? undefined}
	/>
{/each}
