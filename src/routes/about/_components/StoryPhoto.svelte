<script lang="ts">
	// Imports
	import { Figcaption, Figure, Img } from '#lib/components';
	import { twMerge } from 'tailwind-merge';

	// $props()
	let {
		alt,
		caption = 'Generated photo placeholder',
		class: className = '',
		height = 533,
		isPriority = false,
		src,
		width = 1200
	}: {
		alt: string;
		caption?: string | null;
		class?: string;
		height?: number;
		isPriority?: boolean;
		src: string;
		width?: number;
	} = $props();
</script>

<Figure class={twMerge('relative m-0 flex flex-col overflow-hidden rounded-sm', className)}>
	<Img
		{src}
		{alt}
		{width}
		{height}
		loading={isPriority ? 'eager' : 'lazy'}
		fetchpriority={isPriority ? 'high' : 'auto'}
		class="h-full min-h-64 w-full object-cover"
	/>
	{#if caption}
		<Figcaption
			class="absolute right-3 bottom-3 rounded-sm bg-gray-950/80 px-3 py-2 text-xs text-white"
		>
			{caption}
		</Figcaption>
	{/if}
</Figure>
