<script lang="ts">
	// Imports
	import {
		Circle,
		Defs,
		Ellipse,
		G,
		LinearGradient,
		Path,
		Rect,
		Stop,
		Svg,
		Text
	} from '#lib/components';

	// consts
	const controlId = $props.id();

	// $props()
	let { concept, isBack = false }: { concept: string; isBack?: boolean } = $props();
</script>

<Svg
	viewBox="0 0 480 520"
	class="size-full"
	aria-hidden="true"
	focusable="false"
	data-wine-concept={concept}
	data-wine-side={isBack ? 'back' : 'front'}
>
	<Defs>
		<LinearGradient id={`${controlId}-glass`}>
			<Stop offset="0" stop-color="#102a21" /><Stop offset="0.3" stop-color="#365c3b" /><Stop
				offset="0.65"
				stop-color="#233e2b"
			/><Stop offset="1" stop-color="#0c2018" />
		</LinearGradient>
	</Defs>
	<Ellipse cx="240" cy="484" rx="85" ry="10" class="fill-gray-950/10" />
	<G class="drop-shadow-xl">
		<Path
			d="M217 39H263V157C263 200 310 212 310 255V465Q310 480 296 480H184Q170 480 170 465V255C170 212 217 200 217 157Z"
			fill={`url(#${controlId}-glass)`}
		/>
		<Rect
			x="215"
			y="31"
			width="50"
			height="86"
			rx="3"
			class={concept === 'estate' ? 'fill-stone-800' : 'fill-rose-950'}
		/>
		<Path d="M221 49H259M221 103H259M188 258V454" class="stroke-white/15" stroke-width="3" />
		<Rect
			x="178"
			y="267"
			width="124"
			height="166"
			rx="2"
			class={concept === 'estate' ? 'fill-stone-100' : 'fill-rose-100'}
		/>
		{#if isBack}
			<Text x="190" y="292" class="fill-gray-950 font-sans text-[10px] font-semibold">
				THE STORY CONTINUES.
			</Text>
			<Text x="190" y="314" class="fill-gray-700 font-sans text-[7px]">
				Your wine story and
			</Text><Text x="190" y="326" class="fill-gray-700 font-sans text-[7px]">
				approved product information.
			</Text>
			{#each [347, 359, 371, 383] as y (y)}<Path
					d={`M190 ${y}H290`}
					class="stroke-gray-400"
				/>{/each}
			<Text x="190" y="412" class="fill-gray-600 font-sans text-[6px]">
				CONCEPT / NOT FOR PRODUCTION
			</Text>
		{:else}
			{#if concept === 'estate'}
				<Path
					d="M240 350C210 333 221 312 242 304M240 350C266 331 257 313 245 309M239 350V366M240 328Q215 325 216 311Q231 309 240 328M242 321Q264 318 265 304Q249 302 242 321"
					class="fill-none stroke-green-800"
					stroke-width="1.5"
				/>
				{#each [[235, 340], [244, 338], [251, 345], [240, 348], [247, 353], [238, 358]] as point, index (index)}<Circle
						cx={point[0]}
						cy={point[1]}
						r="4"
						class="fill-violet-950"
					/>{/each}
			{:else}
				<Circle cx="240" cy="330" r="28" class="fill-rose-900" /><Path
					d="M196 349L224 313L259 356L283 333V372H196Z"
					class="fill-orange-300"
				/>
			{/if}
			<Text
				x="240"
				y="292"
				text-anchor="middle"
				class="fill-gray-950 font-serif text-[13px] tracking-wider"
			>
				FIELD &amp; VINE
			</Text>
			<Text
				x="240"
				y="394"
				text-anchor="middle"
				class="fill-gray-950 font-sans text-[8px] tracking-widest"
			>
				YOUR WINE STORY
			</Text>
			<Text x="240" y="416" text-anchor="middle" class="fill-gray-600 font-sans text-[6px]">
				FICTIONAL DESIGN CONCEPT
			</Text>
		{/if}
	</G>
</Svg>
