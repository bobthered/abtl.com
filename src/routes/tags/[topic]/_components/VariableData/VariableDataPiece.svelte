<script lang="ts">
	// Imports
	import { Div, Img, P, Span, StockTag } from '#lib/components';
	import type { VariableExample } from './examples';

	// $props()
	let {
		class: className = '',
		isCompact = false,
		isLabel = false,
		isMailing = false,
		record
	}: {
		class?: string;
		isCompact?: boolean;
		isLabel?: boolean;
		isMailing?: boolean;
		record: VariableExample;
	} = $props();
</script>

<Div
	class={`relative ${isLabel ? 'aspect-square rounded-sm bg-white p-6 shadow-lg' : 'aspect-1/2'} ${className}`}
	data-variable-piece={record.id}
>
	{#if !isLabel}<StockTag class="absolute inset-0 h-full w-full text-white drop-shadow-lg" />{/if}
	<Div
		class={isLabel
			? 'flex h-full flex-col justify-between gap-4 text-gray-950'
			: isCompact
				? 'absolute inset-x-3 top-1/5 bottom-4 flex flex-col justify-between gap-2 text-gray-950'
				: 'absolute inset-x-5 top-1/5 bottom-6 flex flex-col justify-between gap-3 text-gray-950'}
	>
		<Div>
			<P class="text-xs font-semibold tracking-widest text-primary-600 uppercase"
				>{isMailing ? 'A message for you' : isCompact ? 'ABTL' : 'Allen-Bailey'}</P
			>
			<P class={`leading-tight font-semibold ${isCompact ? 'mt-2 text-sm' : 'mt-3 text-lg'}`}
				>{isMailing ? record.name : record.item}</P
			>
			<P class="mt-2 text-xs leading-relaxed"
				>{isMailing ? record.address : record.location}{#if isMailing}<Span class="block"
						>Sampletown, NY 00000</Span
					>{/if}</P
			>
		</Div>
		<Div class={`flex items-end justify-between ${isCompact ? 'gap-1' : 'gap-3'}`}>
			<Div class="min-w-0 flex-1">
				<Img
					src={record.barcode}
					alt={`Example Code 128 barcode encoding ${record.id}`}
					class={`w-full object-fill ${isCompact ? 'h-6' : 'h-10'}`}
					width={242}
					height={100}
				/>
				<P class="mt-2 font-mono text-xs">{record.id}</P>
			</Div>
			<Img
				src={record.qr}
				alt={`Example QR code encoding ${record.id}`}
				class={`shrink-0 ${isCompact ? 'size-8' : 'size-12'}`}
				width={58}
				height={58}
			/>
		</Div>
	</Div>
</Div>
