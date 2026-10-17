<script lang="ts">
	// Imports
	import type { AttachmentKind } from './options';
	import { Circle, Path, Svg } from '#lib/components';
	import patchSvg from '#lib/assets/tag-patch.svg?raw';
	import { twMerge } from 'tailwind-merge';

	// consts
	const patchPath = patchSvg.match(/\sd="([^"]+)"/)![1];

	// $props()
	let { kind, variant }: { kind: AttachmentKind; variant: string } = $props();

	// $derived
	const isBrass = $derived(variant.includes('brass'));
	const isStrand = $derived(kind === 'wire' || kind === 'string' || kind === 'elastic');
	const radius = $derived(variant.startsWith('3/8') ? 30 : variant.startsWith('1/4') ? 24 : 19);
	const strandClass = $derived(
		kind === 'wire'
			? variant.includes('copper')
				? 'stroke-orange-600'
				: 'stroke-gray-500 dark:stroke-gray-300'
			: variant === 'Black'
				? 'stroke-gray-950'
				: variant.includes('twine')
					? 'stroke-tag-brown'
					: 'stroke-stone-100'
	);
	const strandWidth = $derived(
		kind === 'wire'
			? variant.startsWith('26')
				? 1.25
				: variant.startsWith('23')
					? 2
					: 3
			: kind === 'elastic'
				? 7
				: variant.startsWith('#5')
					? 4
					: 6
	);
</script>

<Svg
	viewBox="0 0 200 110"
	preserveAspectRatio={isStrand ? 'none' : 'xMidYMid meet'}
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
	{:else if isStrand}
		<Path
			d="M8 55C38 31 70 31 100 55S162 79 192 55"
			class="fill-none stroke-gray-500/50"
			stroke-width={strandWidth + 1.5}
			stroke-linecap="round"
			vector-effect="non-scaling-stroke"
		/>
		<Path
			d="M8 55C38 31 70 31 100 55S162 79 192 55"
			class={twMerge('fill-none', strandClass)}
			stroke-width={strandWidth}
			stroke-linecap="round"
			vector-effect="non-scaling-stroke"
			data-attachment-material={kind}
		/>
	{:else}
		<Path
			d={patchPath}
			transform="translate(57 4) scale(1.8)"
			fill-rule="evenodd"
			class="fill-tag-brown stroke-gray-950/20 stroke-1"
		/>
	{/if}
</Svg>
