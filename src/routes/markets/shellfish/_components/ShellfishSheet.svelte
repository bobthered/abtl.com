<script lang="ts">
	// Imports
	import { G, Path, Rect, Svg, Text } from '#lib/components';

	// $props()
	let {
		area,
		company,
		heading,
		species
	}: { area: string; company: string; heading: string; species: string } = $props();
</script>

<Svg
	viewBox="0 0 460 530"
	class="size-full"
	aria-hidden="true"
	focusable="false"
	data-shellfish-sheet
>
	<!-- 340:440 preserves the confirmed 8.5 x 11 inch sheet proportion. Cut layout is illustrative. -->
	<Rect
		x="60"
		y="40"
		width="340"
		height="440"
		class="fill-white stroke-gray-950/15 drop-shadow-xl"
		data-shellfish-paper
	/>
	{#each [0, 1, 2, 3, 4, 5] as index (index)}
		<G
			transform={`translate(${76 + (index % 2) * 162} ${58 + Math.floor(index / 2) * 136})`}
			data-shellfish-sheet-tag
		>
			<Rect
				width="146"
				height="120"
				rx="2"
				class="fill-cyan-50 stroke-cyan-900/30"
				stroke-dasharray="2 3"
			/>
			<Rect x="5" y="5" width="136" height="29" rx="2" class="fill-cyan-950" />
			<Text x="11" y="16" class="fill-cyan-200 font-sans text-[6px] tracking-wider">{heading}</Text>
			<Text
				x="11"
				y="27"
				class="fill-white font-sans text-[7px] font-semibold"
				data-shellfish-company
			>
				{company || 'Your Shellfish Company'}
			</Text>
			<Text x="11" y="47" class="fill-cyan-800 font-sans text-[6px] tracking-wider">
				HARVEST AREA
			</Text>
			<Text
				x="11"
				y="59"
				class="fill-gray-950 font-sans text-[7px] font-semibold"
				data-shellfish-area
			>
				{area || 'Your harvest area'}
			</Text>
			<Path d="M11 65H135M11 89H135" class="stroke-cyan-900/20" />
			<Text x="11" y="76" class="fill-cyan-800 font-sans text-[6px] tracking-wider">SHELLFISH</Text>
			<Text
				x="11"
				y="85"
				class="fill-gray-950 font-sans text-[7px] font-semibold"
				data-shellfish-species
			>
				{species}
			</Text>
			<Text x="77" y="76" class="fill-cyan-800 font-sans text-[6px]">DATE / QTY</Text>
			<Text x="77" y="85" class="fill-gray-600 font-mono text-[7px]">____ / ____</Text>
			<Text x="11" y="101" class="fill-cyan-800 font-sans text-[6px] tracking-wider">
				IDENTITY / PERMIT
			</Text>
			<Text x="11" y="112" class="fill-gray-600 font-mono text-[7px]">____________</Text>
			<Text x="135" y="112" text-anchor="end" class="fill-gray-950 font-mono text-[6px]">
				DEMO-{index + 101}
			</Text>
		</G>
	{/each}
	<Path
		d="M60 492V503M400 492V503M60 498H193M268 498H400M43 40H54M43 480H54M48 40V213M48 304V480"
		class="stroke-gray-400"
	/>
	<Text
		x="230"
		y="502"
		text-anchor="middle"
		class="fill-gray-600 font-sans text-xs dark:fill-gray-300"
	>
		8.5 inches
	</Text>
	<Text
		transform="translate(43 260) rotate(-90)"
		text-anchor="middle"
		class="fill-gray-600 font-sans text-xs dark:fill-gray-300"
	>
		11 inches
	</Text>
</Svg>
