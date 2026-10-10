<script lang="ts">
	// Imports
	import { Canvas, Div, Span } from '#lib/components';
	import { warehouseFlow } from '#lib/attachments';

	// $props()
	let {
		class: className = '',
		isPreview = false,
		release = 0,
		stock = 24
	}: {
		class?: string;
		isPreview?: boolean;
		release?: number;
		stock?: number;
	} = $props();
</script>

<Div
	{@attach warehouseFlow}
	class={`relative h-full w-full text-gray-950 dark:text-gray-50 ${className}`}
	data-warehouse-preview={isPreview}
	data-warehouse-release={release}
	data-warehouse-stock={stock}
	aria-hidden="true"
>
	<Canvas class="absolute inset-0 h-full w-full text-primary-500 dark:text-primary-400" />
	<Span class="hidden text-secondary-500 dark:text-secondary-400" data-warehouse-accent />
</Div>
