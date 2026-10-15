<script lang="ts">
	// Imports
	import { Figcaption, LightboxImage } from '#lib/components';
	import { twMerge } from 'tailwind-merge';

	// $props()
	let {
		alt,
		caption = 'Generated photo placeholder',
		class: className = '',
		height = 533,
		imageClass = '',
		isPriority = false,
		lightboxCaption = caption,
		src,
		width = 1200
	}: {
		alt: string;
		caption?: string | null;
		class?: string;
		height?: number;
		imageClass?: string;
		isPriority?: boolean;
		lightboxCaption?: string | null;
		src: string;
		width?: number;
	} = $props();
</script>

<LightboxImage
	{alt}
	caption={lightboxCaption}
	class={className}
	{height}
	imageClass={twMerge('min-h-64', imageClass)}
	{isPriority}
	{src}
	{width}
>
	{#if caption}
		<Figcaption
			class="pointer-events-none absolute right-3 bottom-3 rounded-sm bg-gray-950/80 px-3 py-2 text-xs text-white"
		>
			{caption}
		</Figcaption>
	{/if}
</LightboxImage>
