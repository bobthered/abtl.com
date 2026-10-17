<script lang="ts">
	// Imports
	import { G, Path } from '#lib/components';
	import { twMerge } from 'tailwind-merge';

	// consts
	const knotPath = 'M140 79C150 72 153 82 144 86C136 91 135 79 145 79C156 79 150 91 141 87L151 80';
	const strandPaths = {
		wired: [
			'M89 125Q85 124 88 117C96 112 84 109 92 104C98 99 82 97 85 88C77 62 64 20 91 10C128 -3 145 28 148 59L151 94',
			'M92 124Q96 121 91 116C83 111 97 108 89 103C82 97 91 96 88 87C81 60 73 24 95 16C124 7 139 30 142 61L144 101'
		],
		looped: [
			'M88 124C79 118 81 107 87 104C92 102 96 114 92 124C85 114 70 86 66 62C57 23 78 7 101 11C132 14 143 45 151 81',
			'M92 124C99 118 101 106 94 103C87 99 89 115 88 122C83 102 74 82 76 57C77 23 95 15 112 23C135 34 134 67 140 99'
		],
		knotted: [
			'M89 125C79 120 79 113 83 101C79 84 64 63 67 42C70 13 96 6 116 21C135 36 133 62 142 81L149 108',
			'M92 125C100 121 94 112 92 101C88 83 72 62 76 42C80 21 98 17 113 30C127 43 127 64 141 83L155 105'
		]
	};

	// $props()
	let { kind, variant = '' }: { kind: 'wired' | 'looped' | 'knotted'; variant?: string } = $props();

	// $derived
	const isCopper = $derived(variant.includes('copper'));
	const isDark = $derived(variant === 'Black');
	const isTwine = $derived(variant.includes('twine'));
	const strandClass = $derived(
		kind === 'wired'
			? isCopper
				? 'stroke-orange-600'
				: 'stroke-gray-500 dark:stroke-gray-300'
			: isDark
				? 'stroke-gray-950'
				: isTwine
					? 'stroke-tag-brown'
					: 'stroke-stone-100'
	);
	const strandWidth = $derived(
		kind === 'wired'
			? variant.startsWith('26')
				? 1.2
				: variant.startsWith('23')
					? 1.7
					: 2.3
			: variant.startsWith('#5')
				? 3.5
				: 5
	);
</script>

<G data-attachment-fastening={kind} fill="none" stroke-linecap="round" stroke-linejoin="round">
	{#each strandPaths[kind] as strand (strand)}
		{#if kind !== 'wired'}
			<Path d={strand} class="fill-none stroke-gray-500/60" stroke-width={strandWidth + 1.5} />
		{/if}
		<Path d={strand} class={twMerge('fill-none', strandClass)} stroke-width={strandWidth} />
	{/each}
	{#if kind === 'knotted'}
		<Path d={knotPath} class="fill-none stroke-gray-500/60" stroke-width={strandWidth + 2} />
		<Path d={knotPath} class={twMerge('fill-none', strandClass)} stroke-width={strandWidth} />
	{/if}
</G>
