<script lang="ts">
	// Imports
	import { Canvas, Div, Span, StockTag } from '#lib/components';
	import { twMerge } from 'tailwind-merge';
	import { weatherTag } from '#lib/attachments';

	// $props()
	let {
		attachment = 'wire',
		class: className = '',
		isBackdropVisible = true,
		isPreview = false,
		isStorm = false,
		material = 'SYNTHETIC',
		windStrength = isStorm ? 100 : 0
	}: {
		attachment?: 'wire' | 'string' | 'elastic';
		class?: string;
		isBackdropVisible?: boolean;
		isPreview?: boolean;
		isStorm?: boolean;
		material?: string;
		windStrength?: number;
	} = $props();
</script>

<Div
	{@attach weatherTag}
	class={twMerge(
		'group/weather relative h-full w-full overflow-hidden text-gray-950 dark:text-gray-50',
		className
	)}
	data-weather-tag
	data-weather-attachment={attachment}
	data-weather-material={material}
	data-weather-preview={isPreview}
	data-weather-storm={isStorm}
	data-weather-wind={windStrength}
	aria-hidden="true"
>
	{#if isBackdropVisible && !isPreview}
		<Div
			class="pointer-events-none absolute inset-0 bg-radial from-primary-300/70 via-primary-200/30 to-transparent dark:from-primary-600/20 dark:via-primary-900/10"
		/>
	{/if}
	<Div
		data-weather-subject
		class={twMerge(
			'absolute inset-y-0 right-0 flex w-full items-center justify-center group-data-[weather-ready=true]/weather:invisible',
			isPreview ? '@min-xl/bento:w-3/5' : ''
		)}
	>
		<StockTag class="w-28 text-white" />
	</Div>
	<Canvas
		class="absolute inset-0 h-full w-full text-primary-700 drop-shadow-sm dark:text-primary-300 dark:drop-shadow-none"
	/>
	<Span class="hidden text-secondary-500 dark:text-secondary-300" data-weather-accent />
</Div>
