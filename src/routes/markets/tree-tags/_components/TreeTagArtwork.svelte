<script lang="ts">
	// Imports
	import { Circle, ClipPath, Defs, G, Path, Rect, Svg, Text } from '#lib/components';
	import patchSvg from '#lib/assets/tag-patch.svg?raw';
	import shapeSvg from '#lib/assets/tag-shape.svg?raw';

	// consts
	const clipId = $props.id();
	const patchPath = patchSvg.match(/\sd="([^"]+)"/)![1];
	const standardPath = shapeSvg.match(/\sd="([^"]+)"/)![1];
	// Original concept silhouette with an extended stem and open fastening slot.
	const treePath =
		'M112 10Q112 2 120 5L143 34Q148 42 140 45L128 38L146 66Q151 75 141 78L128 68L146 96Q151 105 142 109L128 99L128 130Q129 149 140 163L171 211L157 214L190 271L176 275L211 338L196 342L229 425Q233 438 220 440H18Q5 438 9 425L43 342L28 338L64 275L50 271L83 214L69 211L102 161Q111 148 112 130ZM106 178H131A3 3 0 0 1 131 184H106A3 3 0 0 1 106 178Z';

	// $props()
	let {
		company = 'Your Tree Farm',
		isBack = false,
		number = 'T-1048',
		shape = 'standard',
		treeName = 'Fraser Fir'
	}: {
		company?: string;
		isBack?: boolean;
		number?: string;
		shape?: string;
		treeName?: string;
	} = $props();

	// $derived
	const isTree = $derived(shape === 'tree');
	const outline = $derived(isTree ? treePath : standardPath);
</script>

<Svg
	viewBox="0 0 480 480"
	class="size-full overflow-visible"
	aria-hidden="true"
	focusable="false"
	data-tree-artwork={shape}
	data-tree-artwork-side={isBack ? 'back' : 'front'}
>
	<Defs><ClipPath id={clipId}><Path d={outline} clip-rule="evenodd" /></ClipPath></Defs>
	<G transform="translate(138 30) scale(0.86)" class="drop-shadow-xl">
		<Path d={outline} fill-rule="evenodd" class="fill-white stroke-gray-950/15" data-tree-outline />
		<G clip-path={`url(#${clipId})`}>
			{#if isTree}<Path d="M0 0H237V318H0Z" class="fill-green-900" /><Path
					d="M0 311L237 293V322H0Z"
					class="fill-red-700"
				/>{:else}<Path d="M0 70H237V283H0Z" class="fill-green-900" /><Path
					d="M0 274L237 260V289H0Z"
					class="fill-red-700"
				/>{/if}
			{#if !isBack}
				<G transform={isTree ? 'translate(86 192) scale(0.65)' : 'translate(86 140) scale(0.65)'}>
					<Path d="M50 0L77 39H66L91 77H76L100 118H0L24 77H9L34 39H23Z" class="fill-green-300" />
					<Path d="M50 0V118H100L76 77H91L66 39H77Z" class="fill-green-500" />
					<Path d="M44 118H56V134H44Z" class="fill-amber-200" />
					<Circle cx="32" cy="75" r="3" class="fill-white/80" /><Circle
						cx="64"
						cy="96"
						r="3"
						class="fill-white/80"
					/>
				</G>
			{/if}
			<Text
				x="118.5"
				y={isTree ? 285 : 111}
				text-anchor="middle"
				class="fill-white font-sans text-[11px] font-semibold tracking-wider"
				data-tree-company
			>
				{company || 'Your Tree Farm'}
			</Text>
			{#if isBack}
				<Text
					x="118.5"
					y={isTree ? 232 : 175}
					text-anchor="middle"
					class="fill-white font-sans text-xs font-semibold"
				>
					TREE DETAILS
				</Text>
				<Text
					x="118.5"
					y={isTree ? 252 : 200}
					text-anchor="middle"
					class="fill-white/80 font-sans text-[9px]"
				>
					Your message goes here.
				</Text>
				<Path
					d={isTree ? 'M78 215H159M78 264H159' : 'M45 151H192M45 224H192'}
					class="stroke-white/30"
				/>
			{:else if !isTree}<Text
					x="118.5"
					y="132"
					text-anchor="middle"
					class="fill-green-200 font-sans text-[8px] tracking-widest"
				>
					GROWN WITH CARE
				</Text>{/if}
			<Rect
				x={isTree ? 49 : 20}
				y={isTree ? 327 : 302}
				width={isTree ? 139 : 197}
				height="43"
				rx="2"
				class="fill-gray-50 stroke-gray-300"
			/>
			<Text
				x="118.5"
				y={isTree ? 345 : 320}
				text-anchor="middle"
				class="fill-gray-600 font-sans text-[7px] tracking-widest"
			>
				{isBack ? 'YOUR TREE RECORD' : 'TREE TYPE'}
			</Text>
			<Text
				x="118.5"
				y={isTree ? 361 : 336}
				text-anchor="middle"
				class="fill-gray-950 font-sans text-[10px] font-semibold"
				data-tree-name
			>
				{treeName || 'Your tree type'}
			</Text>
			<Rect
				x={isTree ? 43 : 20}
				y={isTree ? 379 : 360}
				width={isTree ? 151 : 197}
				height="44"
				rx="2"
				class="fill-gray-50 stroke-gray-300"
			/>
			<Text
				x="118.5"
				y={isTree ? 396 : 377}
				text-anchor="middle"
				class="fill-gray-600 font-sans text-[7px] tracking-widest"
			>
				TREE / RECORD NUMBER
			</Text>
			<Text
				x="118.5"
				y={isTree ? 413 : 396}
				text-anchor="middle"
				class="fill-gray-950 font-mono text-sm font-semibold"
				data-tree-number
			>
				{number || 'YOUR ID'}
			</Text>
			{#if !isTree}<Path d="M20 429H217" class="stroke-gray-300" /><Text
					x="118.5"
					y="447"
					text-anchor="middle"
					class="fill-gray-600 font-sans text-[8px]"
				>
					Your information. At the tree.
				</Text>{/if}
		</G>
		{#if !isTree}<Path
				d={patchPath}
				transform="translate(94.1475 0.057)"
				fill-rule="evenodd"
				class="fill-tag-brown"
				data-tree-patch
			/>{/if}
	</G>
</Svg>
