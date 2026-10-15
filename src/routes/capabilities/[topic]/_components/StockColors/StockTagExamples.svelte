<script lang="ts">
	// Imports
	import { Figcaption, LightboxImage, Marquee, P } from '#lib/components';
	import { stockPhotoExamples } from './stockPhotoExamples';

	// $state
	let activeExampleId = $state<string | null>(null);
</script>

<Marquee
	ariaLabel="Stock tag colors in use"
	class="mask-x-from-90% mask-x-to-100%"
	items={stockPhotoExamples}
	pixelsPerSecond={24}
	isPaused={activeExampleId !== null}
	isCopiesInteractive
>
	{#snippet renderItem(example, isDuplicate)}
		<LightboxImage
			surface="neutral"
			class="w-80 shrink-0 p-6 sm:w-96"
			data-stock-photo-color={example.id}
			aria-label={`Enlarge ${example.color} tag example`}
			tabindex={isDuplicate ? -1 : undefined}
			src={example.image}
			alt={example.alt}
			caption={`${example.color}: ${example.context}`}
			imageClass="aspect-4/3"
			onVisibilityChange={(isVisible) => {
				if (isVisible) activeExampleId = example.id;
				else if (activeExampleId === example.id) activeExampleId = null;
			}}
		>
			<Figcaption>
				<P class="font-medium">{example.color}</P>
				<P class="mt-2 text-sm text-gray-600 dark:text-gray-300">{example.context}</P>
			</Figcaption>
		</LightboxImage>
	{/snippet}
</Marquee>
