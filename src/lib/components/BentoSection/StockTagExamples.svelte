<script lang="ts">
	// Imports
	import { BentoItem, Figcaption, Figure, ImageLightbox, Img, Marquee, P } from '#lib/components';
	import { SvelteMap } from 'svelte/reactivity';
	import { stockPhotoExamples } from './stockPhotoExamples';

	// Types
	type LightboxSelection = (typeof stockPhotoExamples)[number] & {
		isVisible: boolean;
		origin: DOMRect;
	};

	// consts
	const preloadedImages = new SvelteMap<string, Promise<void>>();

	// helpers
	const openImage = (event: MouseEvent, example: (typeof stockPhotoExamples)[number]) => {
		const image = (event.currentTarget as HTMLElement).querySelector('img');
		if (!image) return;
		preloadImage(example.image);
		// Keep visibility on this selection so delayed close events cannot affect a later opening.
		selectedExample = { ...example, isVisible: true, origin: image.getBoundingClientRect() };
	};

	const preloadImage = (src: string) => {
		if (preloadedImages.has(src)) return;
		const image = new Image();
		image.decoding = 'async';
		image.src = src;
		preloadedImages.set(
			src,
			image.decode().catch(() => {
				// Allow another hover or click to retry a failed request.
				preloadedImages.delete(src);
			})
		);
	};

	// $state
	let selectedExample = $state<LightboxSelection | null>(null);

	// $derived
	const isLightboxVisible = $derived(selectedExample?.isVisible ?? false);
</script>

<Marquee
	ariaLabel="Stock tag colors in use"
	items={stockPhotoExamples}
	pixelsPerSecond={24}
	isPaused={isLightboxVisible}
	isCopiesInteractive
>
	{#snippet renderItem(example, isDuplicate)}
		<BentoItem
			surface="neutral"
			class="w-80 shrink-0 p-6 sm:w-96"
			data-stock-photo-color={example.id}
			aria-label={`Enlarge ${example.color} tag example`}
			aria-haspopup="dialog"
			tabindex={isDuplicate ? -1 : undefined}
			onclick={(event) => openImage(event, example)}
			onfocusin={() => preloadImage(example.image)}
			onpointerenter={() => preloadImage(example.image)}
		>
			<Figure class="flex flex-col gap-6">
				<Img
					src={example.image}
					alt={example.alt}
					width="960"
					height="720"
					loading="lazy"
					decoding="async"
					class="aspect-4/3 w-full rounded-sm object-cover"
				/>
				<Figcaption>
					<P class="font-medium">{example.color}</P>
					<P class="mt-2 text-sm text-gray-600 dark:text-gray-300">{example.context}</P>
				</Figcaption>
			</Figure>
		</BentoItem>
	{/snippet}
</Marquee>

{#each selectedExample ? [selectedExample] : [] as selection (selection)}
	<ImageLightbox
		bind:isVisible={selection.isVisible}
		origin={selection.origin}
		src={selection.image}
		alt={selection.alt}
		caption={`${selection.color}: ${selection.context}`}
	/>
{/each}
