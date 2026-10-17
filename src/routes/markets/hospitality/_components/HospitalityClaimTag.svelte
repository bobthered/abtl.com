<script lang="ts">
	// Imports
	import { Luggage } from '#lib/icons';
	import { LuggageClaimTag, Path, Rect, Text } from '#lib/components';

	// $props()
	let {
		isLabelSeparated = false,
		isSeparated = false,
		number,
		property
	}: {
		isLabelSeparated?: boolean;
		isSeparated?: boolean;
		number: string;
		property: string;
	} = $props();
</script>

<LuggageClaimTag
	class="h-full"
	viewBox="-65 -10 390 750"
	{isLabelSeparated}
	{isSeparated}
	aria-hidden="true"
	focusable="false"
>
	{#snippet header()}
		<Path d="M0 45H180V88H0Z" class="fill-slate-900" />
		<Text
			x="90"
			y="63"
			text-anchor="middle"
			class="fill-amber-200 font-sans text-[10px]"
			data-hospitality-property
		>
			{property || 'Your Hotel'}
		</Text>
		<Text
			x="90"
			y="80"
			text-anchor="middle"
			class="fill-white font-sans text-[9px] font-semibold tracking-widest"
		>
			LUGGAGE CLAIM
		</Text>
	{/snippet}
	{#snippet label(index: number, y: number)}
		<Rect
			x="6"
			y={y + 5}
			width="168"
			height={Math.min(61, 498 - y)}
			rx="2"
			class="fill-amber-50 stroke-gray-300"
		/>
		<Luggage
			x="16"
			y={y + 15}
			width="24"
			height="24"
			class="fill-none stroke-slate-700"
			stroke-width={1.5}
			aria-hidden="true"
		/>
		<Text x="53" y={y + 17} class="fill-gray-600 font-sans text-[7px] tracking-wider">
			BAG {index + 1} / 6
		</Text>
		<Text
			x="53"
			y={y + 39}
			class="fill-gray-950 font-mono text-lg font-semibold"
			data-hospitality-number
		>
			{number || 'YOUR ID'}
		</Text>
		<Text x="53" y={y + 51} class="fill-gray-600 font-sans text-[5px]">MATCHING LUGGAGE LABEL</Text>
	{/snippet}
	{#snippet stub()}
		<Rect y="504" width="180" height="144" class="fill-tag-buff" />
		<Path d="M0 504H180" stroke-dasharray="3 3" class="stroke-gray-500/60" />
		<Text
			x="90"
			y="526"
			text-anchor="middle"
			class="fill-gray-700 font-sans text-[8px] tracking-wider"
		>
			GUEST CLAIM CHECK
		</Text>
		<Text x="90" y="549" text-anchor="middle" class="fill-gray-700 font-sans text-[9px]">
			{property || 'Your Hotel'}
		</Text>
		<Text
			x="90"
			y="581"
			text-anchor="middle"
			class="fill-gray-950 font-mono text-2xl font-semibold"
			data-hospitality-number
		>
			{number || 'YOUR ID'}
		</Text>
		<Text x="90" y="608" text-anchor="middle" class="fill-gray-700 font-sans text-[8px]">
			6 matching luggage labels
		</Text>
		<Text x="90" y="629" text-anchor="middle" class="fill-gray-700 font-sans text-[8px]">
			Keep this check with you.
		</Text>
	{/snippet}
</LuggageClaimTag>
