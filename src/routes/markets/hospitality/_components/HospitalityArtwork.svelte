<script lang="ts">
	// Imports
	import { ClipPath, Defs, G, Path, Svg, Text } from '#lib/components';
	import patchSvg from '#lib/assets/tag-patch.svg?raw';
	import shapeSvg from '#lib/assets/tag-shape.svg?raw';

	// consts
	const controlId = $props.id();
	const patchPath = patchSvg.match(/\sd="([^"]+)"/)![1];
	const shapePath = shapeSvg.match(/\sd="([^"]+)"/)![1];

	// $props()
	let {
		fields = [],
		format = 'tag',
		heading = 'LUGGAGE CLAIM',
		isBack = false,
		number = '02841',
		property = 'Your Hotel'
	}: {
		fields?: string[];
		format?: 'tag' | 'door';
		heading?: string;
		isBack?: boolean;
		number?: string;
		property?: string;
	} = $props();
</script>

<Svg
	viewBox="0 0 480 520"
	class="size-full overflow-visible"
	aria-hidden="true"
	focusable="false"
	data-hospitality-artwork={format}
>
	<Defs>
		<ClipPath id={`${controlId}-shape`}><Path d={shapePath} clip-rule="evenodd" /></ClipPath>
	</Defs>
	{#if format === 'door'}
		<G transform="translate(140 23) scale(0.85)" class="drop-shadow-xl">
			<Path
				d="M20 0H217Q237 0 237 20V474H0V20Q0 0 20 0ZM118.5 30a42 42 0 1 0 0 84a42 42 0 1 0 0-84Z"
				fill-rule="evenodd"
				class={isBack ? 'fill-teal-800 stroke-gray-950/20' : 'fill-slate-900 stroke-gray-950/20'}
			/>
			<Text
				x="118.5"
				y="151"
				text-anchor="middle"
				class="fill-amber-200 font-sans text-[11px] tracking-widest"
				data-hospitality-property
			>
				{property || 'Your Hotel'}
			</Text>
			<Path d="M40 176H197" class="stroke-amber-200/40" />
			<Text x="118.5" y="246" text-anchor="middle" class="fill-white font-sans text-2xl font-light">
				A little
			</Text>
			<Text x="118.5" y="279" text-anchor="middle" class="fill-white font-sans text-2xl font-light">
				{isBack ? 'refresh, please.' : 'quiet, please.'}
			</Text>
			<Text
				x="118.5"
				y="330"
				text-anchor="middle"
				class="fill-amber-200 font-sans text-[10px] font-semibold tracking-widest"
			>
				{isBack ? 'PLEASE SERVICE ROOM' : 'DO NOT DISTURB'}
			</Text>
			<Path d="M63 365H174" class="stroke-white/30" />
			<Text x="118.5" y="412" text-anchor="middle" class="fill-white/70 font-sans text-[9px]">
				Thank you for looking after the details.
			</Text>
		</G>
	{:else}
		<G transform="translate(138 24) scale(0.86)" class="drop-shadow-xl">
			<G>
				<Path
					d={shapePath}
					fill-rule="evenodd"
					class="fill-white stroke-gray-950/15"
					data-hospitality-tag-outline
				/>
				<G clip-path={`url(#${controlId}-shape)`}>
					<Path d="M0 76H237V170H0Z" class="fill-slate-900" />
					<Text
						x="118.5"
						y="109"
						text-anchor="middle"
						class="fill-amber-200 font-sans text-[11px] tracking-widest"
						data-hospitality-property
					>
						{property || 'Your Hotel'}
					</Text>
					<Text
						x="118.5"
						y="143"
						text-anchor="middle"
						class="fill-white font-sans text-sm font-semibold"
					>
						{heading}
					</Text>
					{#each fields as field, index (field)}<Text
							x="20"
							y={207 + index * 55}
							class="fill-gray-600 font-sans text-[9px]"
						>
							{field.toUpperCase()}
						</Text><Path d={`M20 ${230 + index * 55}H217`} class="stroke-gray-300" />{/each}
					<Path d="M20 373H217V442H20Z" class="fill-amber-50" />
					<Text
						x="118.5"
						y="397"
						text-anchor="middle"
						class="fill-gray-600 font-sans text-[8px] tracking-widest"
					>
						YOUR REFERENCE
					</Text>
					<Text
						x="118.5"
						y="425"
						text-anchor="middle"
						class="fill-gray-950 font-mono text-xl font-semibold"
						data-hospitality-number
					>
						{number || 'YOUR ID'}
					</Text>
				</G>
				<Path
					d={patchPath}
					transform="translate(94.1475 0.057)"
					fill-rule="evenodd"
					class="fill-tag-brown"
					data-hospitality-patch
				/>
			</G>
		</G>
	{/if}
</Svg>
