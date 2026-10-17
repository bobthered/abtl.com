<script lang="ts">
	// Imports
	import type { AttachmentKind } from './options';
	import { AttachmentFastening, Circle, G, Path, Svg } from '#lib/components';
	import patchSvg from '#lib/assets/tag-patch.svg?raw';

	// consts
	const patchPath = patchSvg.match(/\sd="([^"]+)"/)![1];

	// $props()
	let {
		kind,
		stringFinish = 'looped',
		variant
	}: { kind: AttachmentKind; stringFinish?: 'looped' | 'knotted'; variant: string } = $props();

	// $derived
	const isBrass = $derived(variant.includes('brass'));
	const radius = $derived(variant.startsWith('3/8') ? 30 : variant.startsWith('1/4') ? 24 : 19);
</script>

<Svg
	viewBox={kind === 'wire' || kind === 'string' || kind === 'elastic'
		? '0 0 200 180'
		: '0 0 200 110'}
	class="h-24 w-full"
	aria-hidden="true"
	focusable="false"
>
	{#if kind === 'eyelets'}
		<Circle
			cx="100"
			cy="55"
			r={radius + 9}
			class={isBrass
				? 'fill-amber-300 stroke-amber-700 stroke-2'
				: 'fill-gray-300 stroke-gray-500 stroke-2'}
		/>
		<Circle cx="100" cy="55" r={radius + 5} class="fill-none stroke-white/60 stroke-2" />
		<Circle
			cx="100"
			cy="55"
			r={radius - 5}
			class="fill-gray-50 stroke-gray-500/50 stroke-2 dark:fill-gray-950"
		/>
	{:else if kind === 'wire' || kind === 'string' || kind === 'elastic'}
		<Path
			d={patchPath}
			transform="translate(87.02 125.457) scale(0.55)"
			fill-rule="evenodd"
			class="fill-tag-brown"
		/>
		<G transform="translate(10 20)">
			<AttachmentFastening
				kind={kind === 'wire' ? 'wired' : kind === 'string' ? stringFinish : 'knotted'}
				{variant}
			/>
		</G>
	{:else}
		<Path
			d={patchPath}
			transform="translate(57 4) scale(1.8)"
			fill-rule="evenodd"
			class="fill-tag-brown stroke-gray-950/20 stroke-1"
		/>
	{/if}
</Svg>
