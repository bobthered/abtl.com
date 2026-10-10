<script lang="ts">
	// Imports
	import { Canvas, Div, StockTag } from '#lib/components';
	import { processPrint } from '#lib/attachments';

	// $props()
	let {
		channels = '1111',
		class: className = '',
		isBack = false,
		isDuplex = false,
		isPreview = false,
		isSeparated = false
	}: {
		channels?: string;
		class?: string;
		isBack?: boolean;
		isDuplex?: boolean;
		isPreview?: boolean;
		isSeparated?: boolean;
	} = $props();
</script>

<Div
	{@attach processPrint}
	class={`group/print relative flex h-full w-full items-center justify-center ${className}`}
	data-print-preview={isPreview}
	data-print-back={isBack}
	data-print-duplex={isDuplex}
	data-print-separated={isSeparated}
	data-print-channels={channels}
	aria-hidden="true"
>
	<Div
		data-print-backdrop
		class="pointer-events-none absolute inset-0 hidden bg-radial from-gray-50/95 via-gray-100/70 via-40% to-transparent to-75% mask-y-from-60% mask-y-to-100% mask-x-from-60% mask-x-to-100% dark:block"
	/>
	<StockTag class="w-32 text-white group-data-[print-ready=true]/print:invisible" />
	<Canvas class="absolute inset-0 h-full w-full" />
</Div>
