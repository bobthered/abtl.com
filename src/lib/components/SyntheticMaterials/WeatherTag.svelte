<script lang="ts">
	// Imports
	import { Canvas, Div, Span, StockTag } from '#lib/components';
	import { weatherTag } from '#lib/attachments';

	// $props()
	let {
		attachment = 'wire',
		class: className = '',
		isPreview = false,
		isStorm = false,
		material = 'SYNTHETIC'
	}: {
		attachment?: 'wire' | 'string' | 'elastic';
		class?: string;
		isPreview?: boolean;
		isStorm?: boolean;
		material?: string;
	} = $props();
</script>

<Div
	{@attach weatherTag}
	class={`group/weather relative h-full w-full overflow-hidden text-gray-950 dark:text-gray-50 ${className}`}
	data-weather-tag
	data-weather-attachment={attachment}
	data-weather-material={material}
	data-weather-preview={isPreview}
	data-weather-storm={isStorm}
	aria-hidden="true"
>
	<Div
		class="pointer-events-none absolute inset-0 bg-radial from-primary-200/50 via-primary-100/10 to-transparent dark:from-primary-600/20 dark:via-primary-900/10"
	/>
	<Div
		class="absolute inset-0 flex items-center justify-center group-data-[weather-ready=true]/weather:invisible"
		><StockTag class="w-28 text-white" /></Div
	>
	<Canvas class="absolute inset-0 h-full w-full text-primary-600 dark:text-primary-300" />
	<Span class="hidden text-secondary-500 dark:text-secondary-300" data-weather-accent />
</Div>
