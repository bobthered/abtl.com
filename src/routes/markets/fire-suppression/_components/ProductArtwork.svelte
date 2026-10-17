<script lang="ts">
	// Imports
	import { collars } from './products';
	import { Circle, G, Path, Rect, Svg, Text } from '#lib/components';
	import type { FireProduct } from './products';
	import patchSvg from '#lib/assets/tag-patch.svg?raw';
	import shapeSvg from '#lib/assets/tag-shape.svg?raw';
	import { twMerge } from 'tailwind-merge';

	// consts
	const patchPath = patchSvg.match(/\sd="([^"]+)"/)![1];
	const shapePath = shapeSvg.match(/\sd="([^"]+)"/)![1];

	// $props()
	let {
		collar = collars[0],
		format,
		isBack = false,
		isBackdropVisible = true,
		product
	}: {
		collar?: (typeof collars)[number];
		format: 'tag' | 'label' | 'collar';
		isBack?: boolean;
		isBackdropVisible?: boolean;
		product?: FireProduct;
	} = $props();
</script>

<Svg
	viewBox="0 0 480 480"
	class="size-full overflow-visible"
	aria-hidden="true"
	focusable="false"
	data-fire-artwork={format}
>
	{#if isBackdropVisible}
		<Circle cx="240" cy="240" r="190" class="fill-primary-500/5" />
		<Circle cx="240" cy="240" r="145" class="fill-none stroke-primary-500/15" />
	{/if}
	{#if format === 'tag'}
		<G transform="translate(139 32) scale(0.85)" class="drop-shadow-xl">
			<Path d={shapePath} fill-rule="evenodd" class="fill-tag-manila stroke-gray-950/15" />
			<Path
				d={patchPath}
				transform="translate(94.1475 0.057)"
				fill-rule="evenodd"
				class="fill-tag-brown"
			/>
			<Path
				d="M20 80H217V148H20Z"
				class={product?.id === 'empty-in-use' && isBack ? 'fill-green-800' : 'fill-red-700'}
			/>
			<Text
				x="118.5"
				y="108"
				text-anchor="middle"
				class="fill-white font-sans text-xs font-semibold tracking-widest"
			>
				{isBack ? 'REVERSE SIDE' : 'YOUR COMPANY'}
			</Text>
			<Text
				x="118.5"
				y="133"
				text-anchor="middle"
				class="fill-white font-sans text-sm font-semibold"
			>
				{product?.id === 'empty-in-use'
					? isBack
						? 'IN USE'
						: 'EMPTY'
					: isBack
						? 'SERVICE RECORD'
						: product?.name.toUpperCase()}
			</Text>
			{#each product?.fields ?? [] as field, index (field)}
				<Text x="24" y={181 + index * 57} class="fill-gray-950 font-sans text-[10px]">
					{field.toUpperCase()}
				</Text>
				<Path d={`M24 ${207 + index * 57}H213`} class="stroke-gray-950/35" />
			{/each}
			<Path d="M24 350H213V423H24Z" class="fill-white/40 stroke-gray-950/20" />
			<Text
				x="118"
				y="374"
				text-anchor="middle"
				class="fill-gray-950 font-sans text-[10px] tracking-widest"
			>
				{isBack ? 'ADDITIONAL NOTES' : 'YOUR SERVICE INFORMATION'}
			</Text>
			<Path d="M36 390H201M36 407H201" class="stroke-gray-950/25" />
		</G>
	{:else if format === 'label'}
		<G class="drop-shadow-xl">
			<Rect x="35" y="100" width="410" height="280" rx="3" class="fill-white stroke-gray-950/15" />
			<Path d="M35 100H445V177H35Z" class="fill-red-700" />
			<Text x="58" y="130" class="fill-white font-sans text-[10px] font-medium tracking-widest">
				YOUR COMPANY / YOUR INFORMATION
			</Text>
			<Text x="58" y="158" class="fill-white font-sans text-base font-semibold">
				{product?.name.toUpperCase()}
			</Text>
			{#if product?.id === 'hmis'}
				{#each [{ color: 'fill-blue-700', name: 'YOUR HEALTH INFORMATION' }, { color: 'fill-red-700', name: 'YOUR FLAMMABILITY INFORMATION' }, { color: 'fill-amber-400', name: 'YOUR PHYSICAL HAZARD INFORMATION' }, { color: 'fill-gray-100', name: 'YOUR PROTECTIVE EQUIPMENT INFORMATION' }] as row, index (row.name)}
					<Rect x="58" y={195 + index * 40} width="32" height="32" class={row.color} />
					<Text x="104" y={216 + index * 40} class="fill-gray-950 font-sans text-[9px]">
						{row.name}
					</Text>
					<Path d={`M104 ${227 + index * 40}H420`} class="stroke-gray-300" />
				{/each}
			{:else if product?.id === 'call-service'}
				<Text
					x="240"
					y="228"
					text-anchor="middle"
					class="fill-red-700 font-sans text-3xl font-bold"
				>
					CALL FOR SERVICE
				</Text>
				<Text
					x="240"
					y="271"
					text-anchor="middle"
					class="fill-gray-950 font-sans text-lg font-semibold"
				>
					YOUR SERVICE PHONE
				</Text>
				<Path d="M90 292H390" class="stroke-gray-300" />
				<Text
					x="240"
					y="329"
					text-anchor="middle"
					class="fill-gray-700 font-sans text-xs tracking-widest"
				>
					YOUR NAME. THEIR NEXT CALL.
				</Text>
			{:else if product?.id === 'six-year' || product?.id === 'e-light'}
				<Text x="58" y="210" class="fill-gray-950 font-sans text-[10px]">
					DATE / TECHNICIAN / EQUIPMENT ID
				</Text>
				<Path d="M58 228H420" class="stroke-gray-300" />
				{#each ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as month, index (month)}
					<Rect
						x={58 + (index % 6) * 61}
						y={247 + Math.floor(index / 6) * 48}
						width="56"
						height="40"
						class="fill-gray-50 stroke-gray-300"
					/>
					<Text
						x={86 + (index % 6) * 61}
						y={272 + Math.floor(index / 6) * 48}
						text-anchor="middle"
						class="fill-gray-950 font-sans text-[10px]"
					>
						{month}
					</Text>
				{/each}
			{:else if product?.id === 'dot-1044'}
				<Text
					x="240"
					y="248"
					text-anchor="middle"
					class="fill-gray-950 font-sans text-4xl font-bold tracking-widest"
				>
					1044
				</Text>
				<Text
					x="240"
					y="286"
					text-anchor="middle"
					class="fill-gray-700 font-sans text-[10px] tracking-widest"
				>
					YOUR SUPPLIED ARTWORK &amp; WORDING
				</Text>
				<Path d="M90 315H390M90 340H390" class="stroke-gray-300" />
			{:else}
				{#each product?.fields ?? [] as field, index (field)}
					<Text x="58" y={211 + index * 48} class="fill-gray-950 font-sans text-[11px]">
						{field.toUpperCase()}
					</Text>
					<Path d={`M58 ${232 + index * 48}H421`} class="stroke-gray-950/25" />
				{/each}
			{/if}
			{#if product?.id === 'peel-stick'}
				<Path d="M400 380L445 335V380Z" class="fill-gray-200" />
				<Path d="M400 380V335H445Z" class="fill-gray-50 stroke-gray-300" />
			{/if}
		</G>
	{:else}
		<G class="drop-shadow-xl">
			<Path
				d="M240 72a168 168 0 1 0 0 336a168 168 0 1 0 0-336ZM240 176a64 64 0 1 1 0 128a64 64 0 1 1 0-128Z"
				fill-rule="evenodd"
				class="fill-white stroke-gray-950/20"
				data-fire-collar-stock
			/>
			<G class={twMerge('fill-current', collar.className)} data-fire-collar-ink>
				<Text
					x="240"
					y="125"
					text-anchor="middle"
					class="font-sans text-sm font-semibold tracking-widest"
				>
					SERVICE RECORD
				</Text>
				<Text
					x="240"
					y="154"
					text-anchor="middle"
					class="font-sans text-base font-bold tracking-widest"
				>
					{collar.name.toUpperCase()}
				</Text>
				{#each [0, 1, 2, 3] as index (index)}
					<Path
						d={`M${100 + index * 14} ${200 - index * 15}L${134 + index * 10} ${215 - index * 15}`}
						class="stroke-current"
					/>
				{/each}
			</G>
			<G class="fill-black text-black" data-fire-collar-personalization>
				<Text x="240" y="340" text-anchor="middle" class="font-sans text-sm font-semibold">
					YOUR COMPANY
				</Text>
				<Text x="240" y="363" text-anchor="middle" class="font-sans text-[10px]">
					LICENSE # / YOUR LICENSE NUMBER
				</Text>
				<Text x="240" y="384" text-anchor="middle" class="font-sans text-[10px]">
					PHONE # / YOUR SERVICE PHONE
				</Text>
			</G>
		</G>
	{/if}
</Svg>
