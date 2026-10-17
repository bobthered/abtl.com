<script lang="ts">
	// Imports
	import { LuggageClaimTag, SvgImage, Text } from '#lib/components';
	import template from './artwork/ticket-template.svg';
	import type { TicketExample } from './ticketExamples';

	// $props()
	let { record }: { record: TicketExample } = $props();
</script>

<LuggageClaimTag
	role="img"
	aria-label={`Sample tag ${record.number}, reference ${record.reference}, ${record.pieces} pieces for ${record.name}`}
	data-variable-ticket={record.reference}
	title={`Number ${record.number} - Reference ${record.reference}`}
	description="Six numbered sections with matching Data Matrix codes and a bottom stub. Gratuities not included."
>
	{#snippet background()}<SvgImage href={template} x={0} y={0} width={180} height={648} />{/snippet}
	{#snippet header()}
		<Text x={11} y={74} class="fill-gray-950 font-sans text-[8px]">{record.name}</Text>
		<Text x={152} y={74} text-anchor="middle" class="fill-gray-950 font-mono text-[10px]">
			{record.pieces}
		</Text>
	{/snippet}
	{#snippet label(index: number, y: number)}
		{@const code = record.codes[index]}
		{#if code}
			<SvgImage
				class="mix-blend-multiply"
				href={code.image}
				x={13}
				{y}
				width={36}
				height={36}
				data-variable-matrix={code.reference}
				data-encoded-value={`${record.number}/${code.reference}`}
			/>
			<Text x={57} y={y + 18} class="fill-gray-950 font-sans text-[16px] font-bold">
				{record.number}
			</Text>
			<Text
				x={57}
				y={y + 34}
				class="fill-gray-950 font-sans text-[16px] font-bold"
				data-variable-reference
			>
				{code.reference}
			</Text>
		{/if}
	{/snippet}
	{#snippet stub()}
		<Text x={152} y={548} text-anchor="middle" class="fill-gray-950 font-mono text-[14px]">
			{record.pieces}
		</Text>
		<SvgImage
			class="mix-blend-multiply"
			href={record.masterCode}
			x={13}
			y={573}
			width={36}
			height={36}
			data-variable-matrix={record.reference}
			data-encoded-value={`${record.number}/${record.reference}`}
		/>
		<Text x={57} y={591} class="fill-gray-950 font-sans text-[16px] font-bold">
			{record.number}
		</Text>
		<Text
			x={57}
			y={607}
			class="fill-gray-950 font-sans text-[16px] font-bold"
			data-variable-reference
		>
			{record.reference}
		</Text>
	{/snippet}
</LuggageClaimTag>
