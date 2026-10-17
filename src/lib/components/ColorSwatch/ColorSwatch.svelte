<script lang="ts">
	// Imports
	import { RadioChoice, Span } from '#lib/components';
	import type { stockColors } from '#lib/data/stockColors.js';
	import { twMerge } from 'tailwind-merge';

	// $props()
	let {
		color,
		group = $bindable(),
		label = color.name,
		name
	}: {
		color: (typeof stockColors)[number];
		group: string;
		label?: string;
		name: string;
	} = $props();

	// $derived
	// These saturated stocks support a light icon; pale stocks need dark ink.
	const isCheckLight = $derived(
		['blue-dark', 'red', 'fluorescent-red', 'fluorescent-pink'].includes(color.id)
	);
</script>

<RadioChoice
	bind:group
	value={color.id}
	{name}
	aria-label={label}
	isSurfaceVisible={false}
	class="size-11 min-h-0 justify-center rounded-full p-1.5"
	contentClass="justify-center"
	indicatorClass={twMerge(
		'top-1/2 right-auto left-1/2 z-1 size-4 -translate-1/2',
		isCheckLight ? 'text-gray-50 dark:text-gray-50' : 'text-gray-950 dark:text-gray-950'
	)}
>
	<Span
		class={twMerge(
			'block size-8 rounded-full bg-current inset-ring-1 inset-ring-gray-950/15',
			color.className
		)}
	/>
</RadioChoice>
