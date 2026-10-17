<script lang="ts">
	// Imports
	import { Defs, Ellipse, G, LinearGradient, Path, Rect, Stop, Svg, Text } from '#lib/components';
	import patchSvg from '#lib/assets/tag-patch.svg?raw';
	import shapeSvg from '#lib/assets/tag-shape.svg?raw';
	import { twMerge } from 'tailwind-merge';

	// consts
	const controlId = $props.id();
	const patchPath = patchSvg.match(/\sd="([^"]+)"/)![1];
	const shapePath = shapeSvg.match(/\sd="([^"]+)"/)![1];

	// $props()
	let { elastic = 'Black', isDetail = false }: { elastic?: string; isDetail?: boolean } = $props();
</script>

{#snippet tag()}
	<Path
		d={shapePath}
		fill-rule="evenodd"
		class="fill-tag-buff stroke-gray-950/15"
		data-growler-tag
	/>
	<Path
		d={patchPath}
		transform="translate(94.1475 0.057)"
		fill-rule="evenodd"
		class="fill-tag-brown"
		data-growler-patch
	/>
	<Text x="24" y="106" class="fill-gray-950 font-sans text-[10px] tracking-widest">
		YOUR BREWERY
	</Text>
	<Text x="24" y="143" class="fill-gray-950 font-sans text-[22px] font-semibold">FRESH</Text>
	<Text x="24" y="171" class="fill-gray-950 font-sans text-[22px] font-semibold">
		FROM THE TAP.
	</Text>
	<Path d="M24 195H213M24 275H213M24 354H213" class="stroke-gray-950/25" />
	<Text x="24" y="230" class="fill-gray-600 font-sans text-[10px] tracking-wider">
		BREW / STYLE
	</Text>
	<Text x="24" y="255" class="fill-gray-950 font-mono text-[14px]">_____________</Text>
	<Text x="24" y="309" class="fill-gray-600 font-sans text-[10px] tracking-wider">
		FILLED / REFERENCE
	</Text>
	<Text x="24" y="334" class="fill-gray-950 font-mono text-[14px]">_____________</Text>
	<Text x="24" y="396" class="fill-gray-950 font-sans text-[12px]">Your message goes here.</Text>
	<Text x="24" y="440" class="fill-gray-600 font-sans text-[8px]">
		ILLUSTRATIVE TAG / NOT A LABEL FORM
	</Text>
{/snippet}

<Svg
	viewBox="0 0 480 520"
	class="size-full"
	aria-hidden="true"
	focusable="false"
	data-growler-view={isDetail ? 'detail' : 'growler'}
	data-growler-elastic={elastic}
>
	<Defs>
		<LinearGradient id={`${controlId}-glass`}>
			<Stop offset="0" stop-color="#451a03" /><Stop offset="0.3" stop-color="#92400e" /><Stop
				offset="0.68"
				stop-color="#78350f"
			/><Stop offset="1" stop-color="#292011" />
		</LinearGradient>
	</Defs>
	{#if isDetail}
		<G transform="translate(153 152) scale(0.73)" class="drop-shadow-xl">
			{@render tag()}
			<Path
				d="M116 36C85 12 65 -15 73 -62C80 -112 152 -114 161 -66C171 -18 146 12 120 36"
				class="fill-none stroke-gray-500/60"
				stroke-width="6"
			/>
			<Path
				d="M116 36C85 12 65 -15 73 -62C80 -112 152 -114 161 -66C171 -18 146 12 120 36"
				class={twMerge('fill-none', elastic === 'Black' ? 'stroke-gray-950' : 'stroke-stone-100')}
				stroke-width="4"
				data-growler-elastic-loop
			/>
		</G>
	{:else}
		<Ellipse cx="229" cy="484" rx="140" ry="12" class="fill-gray-950/10" />
		<Path
			d="M276 137C377 130 385 285 307 300L300 262C338 247 334 185 281 183Z"
			fill={`url(#${controlId}-glass)`}
			fill-rule="evenodd"
			class="stroke-amber-950"
		/>
		<Path
			d="M194 56H264V123C264 153 304 163 323 199C339 228 349 287 349 439Q349 477 316 479H143Q110 477 110 439C110 287 120 228 136 199C155 163 194 153 194 123Z"
			fill={`url(#${controlId}-glass)`}
			class="stroke-amber-950 drop-shadow-xl"
		/>
		<Rect x="190" y="44" width="78" height="35" rx="6" class="fill-gray-950" />
		<Path
			d="M198 52H260M198 61H260M198 70H260M144 233Q126 309 135 424"
			class="fill-none stroke-white/15"
			stroke-width="5"
		/>
		<Ellipse
			cx="229"
			cy="126"
			rx="38"
			ry="8"
			class={twMerge('fill-none', elastic === 'Black' ? 'stroke-gray-950' : 'stroke-stone-100')}
			stroke-width="4"
		/>
		<G transform="translate(258 188) rotate(12 40 20) scale(0.39)" class="drop-shadow-xl">
			{@render tag()}
		</G>
		<!-- A closed elastic loop links the neck to the tag hole; no free ends or string knot. -->
		<Path
			d="M198 126C213 157 282 171 300 204C306 210 309 210 310 202C290 165 252 148 260 126"
			class="fill-none stroke-gray-500/60"
			stroke-width="5"
		/>
		<Path
			d="M198 126C213 157 282 171 300 204C306 210 309 210 310 202C290 165 252 148 260 126"
			class={twMerge('fill-none', elastic === 'Black' ? 'stroke-gray-950' : 'stroke-stone-100')}
			stroke-width="3"
			data-growler-elastic-loop
		/>
		<Text x="177" y="394" class="fill-amber-100/60 font-sans text-[12px] tracking-widest">
			YOUR TAPROOM
		</Text>
	{/if}
</Svg>
