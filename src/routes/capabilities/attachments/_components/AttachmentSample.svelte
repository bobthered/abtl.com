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
	const isCopper = $derived(variant.includes('copper'));
	const isDark = $derived(variant === 'Black');
	const isTwine = $derived(variant.includes('twine'));
	const radius = $derived(variant.startsWith('3/8') ? 30 : variant.startsWith('1/4') ? 24 : 19);
	const wireWidth = $derived(variant.startsWith('25') ? 2 : variant.startsWith('23') ? 3 : 4);
</script>

<Svg viewBox="0 0 200 110" class="h-24 w-full" aria-hidden="true" focusable="false">
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
	{:else if kind === 'wire'}
		<Path
			d="M25 80C50 80 42 25 85 25C135 25 146 71 109 79C85 84 81 55 104 55C134 55 146 76 175 76 M25 87C50 87 48 33 86 33C126 33 135 65 108 71C93 74 92 63 104 63C130 63 146 84 175 84"
			class={twMerge(
				'fill-none',
				isCopper ? 'stroke-orange-600' : 'stroke-gray-500 dark:stroke-gray-300'
			)}
			stroke-width={wireWidth}
			stroke-linecap="round"
		/>
	{:else if kind === 'string'}
		<Path
			d="M25 82C47 80 44 26 82 26C131 26 142 74 103 79C85 82 82 57 101 57C130 57 146 82 175 79"
			class="fill-none stroke-gray-400/60 stroke-8"
			stroke-linecap="round"
		/>
		<Path
			d="M25 82C47 80 44 26 82 26C131 26 142 74 103 79C85 82 82 57 101 57C130 57 146 82 175 79"
			class={twMerge('fill-none', isTwine ? 'stroke-tag-brown' : 'stroke-white')}
			stroke-width={6}
			stroke-linecap="round"
		/>
	{:else if kind === 'elastic'}
		<Path
			d="M100 88C38 88 42 24 100 24C158 24 162 88 100 88Z"
			class="fill-none stroke-gray-400 stroke-8"
		/>
		<Path
			d="M100 88C38 88 42 24 100 24C158 24 162 88 100 88Z"
			class={isDark ? 'fill-none stroke-gray-950 stroke-6' : 'fill-none stroke-white stroke-6'}
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
