<script lang="ts">
	// Imports
	import { Canvas, Div, StockTag } from '#lib/components';
	import { processPrint } from '#lib/attachments';
	import { twMerge } from 'tailwind-merge';

	// $props()
	let {
		channels = '1111',
		class: className = '',
		isBack = false,
		isBackdropVisible = true,
		isDuplex = false,
		isPreview = false,
		isSeparated = false
	}: {
		channels?: string;
		class?: string;
		isBack?: boolean;
		isBackdropVisible?: boolean;
		isDuplex?: boolean;
		isPreview?: boolean;
		isSeparated?: boolean;
	} = $props();
</script>

<Div
	{@attach processPrint}
	class={twMerge('group/print relative flex h-full w-full items-center justify-center', className)}
	data-print-preview={isPreview}
	data-print-back={isBack}
	data-print-duplex={isDuplex}
	data-print-separated={isSeparated}
	data-print-channels={channels}
	aria-hidden="true"
>
	{#if isBackdropVisible && !isPreview}
		<Div
			data-print-backdrop
			class="pointer-events-none absolute inset-0 bg-radial from-gray-500/80 via-gray-400/60 via-40% to-transparent to-75% mask-y-from-60% mask-y-to-100% mask-x-from-60% mask-x-to-100% dark:from-gray-50/95 dark:via-gray-100/70"
		/>
	{/if}
	<StockTag class="w-32 text-white group-data-[print-ready=true]/print:invisible" />
	<Canvas class="absolute inset-0 h-full w-full" />
</Div>
