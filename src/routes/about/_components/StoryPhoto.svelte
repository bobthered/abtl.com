<script lang="ts">
	// Imports
	import { Figcaption, Figure, Img } from '#lib/components';
	import { twMerge } from 'tailwind-merge';

	// $props()
	let {
		alt,
		class: className = '',
		isPriority = false,
		src
	}: { alt: string; class?: string; isPriority?: boolean; src: string } = $props();
</script>

<Figure class={twMerge('relative m-0 overflow-hidden rounded-sm', className)}>
	<Img
		{src}
		{alt}
		width={1200}
		height={533}
		loading={isPriority ? 'eager' : 'lazy'}
		fetchpriority={isPriority ? 'high' : 'auto'}
		class="h-full min-h-64 w-full object-cover"
	/>
	<Figcaption
		class="absolute right-3 bottom-3 rounded-sm bg-gray-950/80 px-3 py-2 text-xs text-white"
	>
		Generated photo placeholder
	</Figcaption>
</Figure>
