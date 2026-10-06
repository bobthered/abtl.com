<script lang="ts">
	// Imports
	import { box, cylinderSide, disc, polygon, project, ring, tag } from './geometry';
	import { Button, Div, G, P, Path, Span, Svg } from '#lib/components';
	import { onMount } from 'svelte';
	import { Pause, Play } from '#lib/icons';
	import { theme } from 'sveltewind/theme';

	// consts
	const faces = ['machineFront', 'machineSide', 'machineTop'];
	const stations = [
		{ label: 'Print', x: 150 },
		{ label: 'Patch', x: 280 },
		{ label: 'Clip', x: 375 },
		{ label: 'Cut', x: 460 }
	];

	// helpers
	const initializeAnimation = () => {
		if (!element) return;
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const animate = (selector: string, frames: Keyframe[], duration: number) => {
			for (const node of element!.querySelectorAll(selector)) {
				animations.push(node.animate(frames, { duration, iterations: Infinity, easing: 'linear' }));
			}
		};
		animate(
			'[data-feed]',
			[{ transform: 'translate(0, 0)' }, { transform: 'translate(38.7px, 14.4px)' }],
			900
		);
		animate(
			'[data-blade]',
			[
				{ transform: 'translateY(0)', offset: 0 },
				{ transform: 'translateY(0)', offset: 0.55 },
				{ transform: 'translateY(22px)', offset: 0.7 },
				{ transform: 'translateY(0)', offset: 0.88 },
				{ transform: 'translateY(0)', offset: 1 }
			],
			900
		);
		animate(
			'[data-landing]',
			[
				{ transform: 'translate(-38.7px, -34.4px)', opacity: 0, offset: 0 },
				{ transform: 'translate(-38.7px, -34.4px)', opacity: 0, offset: 0.7 },
				{ transform: 'translate(-38.7px, -34.4px)', opacity: 1, offset: 0.71 },
				{ transform: 'translate(0, 2px)', opacity: 1, offset: 0.94 },
				{ transform: 'translate(0, 0)', opacity: 1, offset: 1 }
			],
			900
		);
		animate('[data-roll]', [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], 7200);
		animations = [...animations];
		const updatePreference = () => {
			isReducedMotion = preference.matches;
		};
		const observer = new IntersectionObserver(([entry]) => {
			isInView = entry.isIntersecting;
		});
		observer.observe(element);
		updatePreference();
		preference.addEventListener('change', updatePreference);
		document.addEventListener('visibilitychange', updateVisibility);
		updateVisibility();
		return () => {
			observer.disconnect();
			preference.removeEventListener('change', updatePreference);
			document.removeEventListener('visibilitychange', updateVisibility);
			animations.forEach((animation) => animation.cancel());
		};
	};
	const updateVisibility = () => {
		isDocumentVisible = !document.hidden;
	};
	onMount(initializeAnimation);

	// $state
	let animations = $state.raw<Animation[]>([]);
	let element = $state<HTMLDivElement | null>(null);
	let isDocumentVisible = $state(true);
	let isInView = $state(true);
	let isPaused = $state(false);
	let isReducedMotion = $state(false);

	// $effects
	$effect(() => {
		for (const animation of animations) {
			if (isReducedMotion || isPaused || !isInView || !isDocumentVisible) {
				animation.pause();
				if (isReducedMotion) animation.currentTime = 450;
			} else animation.play();
		}
	});
</script>

{#snippet block(
	x: number,
	y: number,
	z: number,
	width: number,
	depth: number,
	height: number,
	isAccent = false
)}
	{#each box(x, y, z, width, depth, height) as face, index (index)}
		<Path d={face} variants={[isAccent ? 'machineAccent' : faces[index]]} />
	{/each}
{/snippet}

{#snippet finishedTag(x: number, y: number, z: number)}
	<Path d={tag(x, y, z)} variants={['machinePaper']} />
	<Path d={disc(x + 15, y + 10, z, 6)} variants={['machinePatch']} />
	<Path d={disc(x + 15, y + 10, z + 0.1, 2)} variants={['machineInk']} />
	<Path
		d={polygon([
			[x + 6, y + 25, z + 0.2],
			[x + 24, y + 25, z + 0.2],
			[x + 24, y + 28, z + 0.2],
			[x + 6, y + 28, z + 0.2]
		])}
		variants={['machineInk']}
	/>
	<Path
		d={polygon([
			[x + 6, y + 33, z + 0.2],
			[x + 18, y + 33, z + 0.2],
			[x + 18, y + 35, z + 0.2],
			[x + 6, y + 35, z + 0.2]
		])}
		variants={['machineInk']}
	/>
{/snippet}

<Div bind:element class={theme.resolve('tagMachine')}>
	<Div class="flex items-center justify-between gap-4 px-2">
		<P variants={['eyebrow']} class="mb-0">From roll to ready.</P>
		<Button
			variants={['ghost']}
			aria-label={isPaused ? 'Play production animation' : 'Pause production animation'}
			aria-pressed={isPaused}
			disabled={isReducedMotion}
			onclick={() => {
				isPaused = !isPaused;
			}}
			class="text-gray-600 dark:text-gray-300"
		>
			{#if isPaused || isReducedMotion}<Play class="size-4" aria-hidden="true" />{:else}<Pause
					class="size-4"
					aria-hidden="true"
				/>{/if}
		</Button>
	</Div>
	<Svg
		viewBox="0 0 660 440"
		role="img"
		aria-label="Isometric tag production line: rolled material is printed, reinforced with patches, clipped, guillotine cut, and stacked on a conveyor."
		variants={['machine']}
	>
		<Path
			d={polygon([
				[-35, -30, -55],
				[625, -30, -55],
				[625, 140, -55],
				[-35, 140, -55]
			])}
			variants={['machineShadow']}
		/>
		{#each [80, 250, 425, 565] as x (x)}
			{@render block(x, 10, -45, 12, 12, 70)}
			{@render block(x, 88, -45, 12, 12, 70)}
		{/each}
		{@render block(65, 0, 15, 540, 110, 12)}
		{@render block(85, 8, 27, 520, 94, 5, true)}
		{#each Array.from({ length: 19 }, (_, index) => 90 + index * 27) as x (x)}
			<Path
				d={polygon([
					[x, 10, 32],
					[x + 3, 10, 32],
					[x + 3, 100, 32],
					[x, 100, 32]
				])}
				variants={['machineBelt']}
			/>
		{/each}
		<!-- Continuous stock travels through the stations until the guillotine. -->
		<Path
			d={polygon([
				[30, 25, 55],
				[110, 25, 35],
				[488, 25, 35],
				[488, 85, 35],
				[110, 85, 35],
				[30, 85, 55]
			])}
			variants={['machinePaper']}
		/>
		<G data-feed>
			{#each [190, 235, 280, 325, 370, 415] as x (x)}
				<Path
					d={polygon([
						[x, 48, 36],
						[x + 18, 48, 36],
						[x + 18, 51, 36],
						[x, 51, 36]
					])}
					variants={['machineInk']}
				/>
				<Path
					d={polygon([
						[x, 57, 36],
						[x + 12, 57, 36],
						[x + 12, 59, 36],
						[x, 59, 36]
					])}
					variants={['machineInk']}
				/>
				{#if x >= 325}<Path
						d={polygon([
							[x + 5, 28, 36],
							[x + 17, 28, 36],
							[x + 17, 38, 36],
							[x + 5, 38, 36]
						])}
						variants={['machinePatch']}
					/>{/if}
			{/each}
		</G>
		<!-- Closed rear cap and tangent-connected side wall form a solid cylinder. -->
		<Path d={ring(30, 20, 78, 48)} variants={['machineRollFace']} />
		<Path d={cylinderSide(30, 20, 78, 48, 70)} variants={['machineRoll']} />
		{#each [48, 39, 30, 21] as radius (radius)}<Path
				d={ring(30, 90, 78, radius)}
				variants={['machineRollFace']}
			/>{/each}
		<Path d={ring(30, 90, 78, 10)} variants={['machineInk']} />
		<G transform={`translate(${project([30, 90, 78]).join(' ')})`}
			><G data-roll><Path d="M-7 -2H7V2H-7Z M-2 -7H2V7H-2Z" variants={['machineSpindle']} /></G></G
		>
		{#each stations as station (station.label)}
			<!-- Open gantries expose the moving stock between each stage. -->
			{@render block(station.x, 2, 32, 14, 12, 74)}
			{@render block(station.x, 94, 32, 14, 12, 74)}
			{@render block(station.x - 6, 0, 100, 38, 110, 14)}
			{@render block(station.x + 1, 107, 81, 12, 2, 8, true)}
			{#if station.label === 'Cut'}
				<G data-blade>{@render block(station.x + 4, 16, 53, 5, 76, 25, true)}</G>
			{:else}
				{@render block(station.x + 2, 16, 44, 22, 76, 15, station.label === 'Print')}
			{/if}
		{/each}
		<!-- Finished tags have clipped top corners and square bottoms. -->
		{#each [0, 1, 2, 3, 4, 5, 6] as layer (layer)}{@render finishedTag(
				547,
				25,
				36 + layer * 1.6
			)}{/each}
		<G data-landing>{@render finishedTag(547, 25, 49)}</G>
	</Svg>
	<Div class="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
		{#each ['Roll', 'Print', 'Patch', 'Clip', 'Cut', 'Stack'] as label, index (label)}
			<Span class="text-xs text-gray-500 dark:text-gray-400"
				><Span class="mr-1 text-primary-500 dark:text-primary-300">0{index + 1}</Span>{label}</Span
			>
		{/each}
	</Div>
</Div>
