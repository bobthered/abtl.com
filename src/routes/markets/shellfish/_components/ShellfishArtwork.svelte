<script lang="ts">
	// Imports
	import { Circle, ClipPath, Defs, G, Path, Rect, Svg, Text } from '#lib/components';
	import patchSvg from '#lib/assets/tag-patch.svg?raw';
	import shapeSvg from '#lib/assets/tag-shape.svg?raw';
	import { twMerge } from 'tailwind-merge';

	// consts
	const controlId = $props.id();
	const patchPath = patchSvg.match(/\sd="([^"]+)"/)![1];
	const standardPath = shapeSvg.match(/\sd="([^"]+)"/)![1];

	// $props()
	let {
		area,
		company,
		heading,
		isAdvanced = false,
		isBack = false,
		isPinfed = false,
		species
	}: {
		area: string;
		company: string;
		heading: string;
		isAdvanced?: boolean;
		isBack?: boolean;
		isPinfed?: boolean;
		species: string;
	} = $props();
</script>

{#snippet fields(isCompact: boolean, reference: string)}
	<Text
		x="20"
		y={isCompact ? 73 : 192}
		class="fill-cyan-800 font-sans text-[8px] font-semibold tracking-widest"
	>
		HARVEST AREA
	</Text>
	<Text
		x="20"
		y={isCompact ? 91 : 214}
		class="fill-gray-950 font-sans text-[12px] font-semibold"
		data-shellfish-area
	>
		{area || 'Your harvest area'}
	</Text>
	<Path
		d={isCompact ? 'M20 100H266M20 139H266' : 'M20 229H217M20 290H217M20 352H217'}
		class="stroke-gray-300"
	/>
	<Text
		x="20"
		y={isCompact ? 114 : 249}
		class="fill-cyan-800 font-sans text-[8px] font-semibold tracking-widest"
	>
		SHELLFISH TYPE
	</Text>
	<Text
		x="20"
		y={isCompact ? 131 : 274}
		class="fill-gray-950 font-sans text-[12px] font-semibold"
		data-shellfish-species
	>
		{species}
	</Text>
	<Text
		x={isCompact ? 163 : 20}
		y={isCompact ? 114 : 310}
		class="fill-cyan-800 font-sans text-[8px] font-semibold tracking-widest"
	>
		DATE / QUANTITY
	</Text>
	<Text
		x={isCompact ? 163 : 20}
		y={isCompact ? 131 : 335}
		class="fill-gray-600 font-mono text-[10px]"
	>
		____ / ____
	</Text>
	<Text
		x="20"
		y={isCompact ? 161 : 378}
		class="fill-cyan-800 font-sans text-[8px] font-semibold tracking-widest"
	>
		IDENTITY / PERMIT
	</Text>
	<Text x="20" y={isCompact ? 176 : 401} class="fill-gray-600 font-mono text-[10px]">
		________________
	</Text>
	<Text
		x={isCompact ? 266 : 217}
		y={isCompact ? 176 : 438}
		text-anchor="end"
		class="fill-gray-950 font-mono text-[9px]"
		data-shellfish-reference
	>
		{reference}
	</Text>
{/snippet}

<Svg
	viewBox="0 0 480 520"
	class="size-full"
	aria-hidden="true"
	focusable="false"
	data-shellfish-artwork={isPinfed ? 'pinfed' : 'standard'}
	data-shellfish-side={isBack ? 'back' : 'front'}
>
	<Defs>
		<ClipPath id={`${controlId}-tag`}><Path d={standardPath} clip-rule="evenodd" /></ClipPath>
		<ClipPath id={`${controlId}-feed`}>
			<Rect x="62" y="22" width="356" height="476" rx="2" />
		</ClipPath>
	</Defs>
	{#if isPinfed}
		<Rect x="52" y="12" width="376" height="496" rx="2" class="fill-cyan-950/10" />
		<G clip-path={`url(#${controlId}-feed)`}>
			<G
				class={twMerge(
					'transition-transform duration-700 ease-in-out motion-reduce:transition-none',
					isAdvanced ? '-translate-y-48' : 'translate-y-0'
				)}
				data-shellfish-feed={isAdvanced ? 'advanced' : 'start'}
			>
				{#each [-130, 62, 254, 446, 638] as y, index (y)}
					<G transform={`translate(62 ${y})`}>
						<Rect width="356" height="192" class="fill-white" />
						<Path
							d="M30 0V192M326 0V192M0 191H356"
							stroke-dasharray="3 4"
							class="stroke-cyan-900/40"
						/>
						{#each [12, 36, 60, 84, 108, 132, 156, 180] as cy (cy)}
							<Circle cx="14" {cy} r="5" class="fill-cyan-950/20" /><Circle
								cx="342"
								{cy}
								r="5"
								class="fill-cyan-950/20"
							/>
						{/each}
						<G transform="translate(35 0)">
							<Rect x="0" y="7" width="286" height="45" rx="2" class="fill-cyan-950" />
							<Text x="20" y="24" class="fill-cyan-200 font-sans text-[8px] tracking-widest">
								{heading}
							</Text>
							<Text
								x="20"
								y="43"
								class="fill-white font-sans text-[12px] font-semibold"
								data-shellfish-company
							>
								{company || 'Your Shellfish Company'}
							</Text>
							{@render fields(true, `DEMO-${String(index + 101).padStart(3, '0')}`)}
						</G>
					</G>
				{/each}
			</G>
		</G>
		<Path d="M44 253H56M424 253H436" class="stroke-cyan-600" stroke-width="3" />
	{:else}
		<G transform="translate(121 20)" class="drop-shadow-xl">
			<Path
				d={standardPath}
				fill-rule="evenodd"
				class="fill-white stroke-gray-950/15"
				data-shellfish-outline
			/>
			<G clip-path={`url(#${controlId}-tag)`}>
				<Rect y="72" width="237" height="94" class="fill-cyan-950" />
				<Text x="20" y="99" class="fill-cyan-200 font-sans text-[9px] tracking-widest">
					{heading}
				</Text>
				<Text
					x="20"
					y="125"
					class="fill-white font-sans text-[12px] font-semibold"
					data-shellfish-company
				>
					{company || 'Your Shellfish Company'}
				</Text>
				<Path d="M0 145Q30 133 60 145T120 145T180 145T240 145V166H0Z" class="fill-cyan-700" />
				{#if isBack}
					<Text x="20" y="203" class="fill-cyan-950 font-sans text-[12px] font-semibold">
						SPACE FOR YOUR
					</Text>
					<Text x="20" y="224" class="fill-cyan-950 font-sans text-[12px] font-semibold">
						APPROVED COPY
					</Text>
					{#each [257, 280, 303, 326, 349] as y (y)}<Path
							d={`M20 ${y}H217`}
							class="stroke-gray-300"
						/>{/each}
					<Text x="20" y="390" class="fill-gray-600 font-sans text-[9px]">
						Handling / retention / advisory
					</Text>
					<Text x="20" y="409" class="fill-gray-600 font-sans text-[9px]">
						wording supplied for your project.
					</Text>
				{:else}{@render fields(false, 'DEMO-102')}{/if}
				<Text x="20" y="461" class="fill-gray-500 font-sans text-[7px] tracking-widest">
					LAYOUT CONCEPT - NOT FOR USE
				</Text>
			</G>
			<Path
				d={patchPath}
				transform="translate(94.15 0.06)"
				fill-rule="evenodd"
				class="fill-tag-brown"
				data-shellfish-patch
			/>
		</G>
	{/if}
</Svg>
