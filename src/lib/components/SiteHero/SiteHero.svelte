<script lang="ts">
	// Imports
	import {
		A,
		Button,
		Container,
		Defs,
		Div,
		G,
		H1,
		LinearGradient,
		P,
		Path,
		Section,
		Span,
		Stop,
		Svg
	} from '#lib/components';
	import { ArrowRight, Pause, Play } from '#lib/icons';
	import { estimateProduction, productionMetric } from '#lib/productionMetric.js';
	import { onMount } from 'svelte';
	import { redPath } from '../Logo/paths';
	import { ribbonBand } from './ribbon';
	import { theme } from 'sveltewind/theme';

	// consts
	const formatter = new Intl.NumberFormat('en-US');
	const words = ['Identify.', 'Organize.', 'Inform.', 'Connect.'];

	// helpers
	const initializeMotion = () => {
		if (!element) return;
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => {
			isReducedMotion = preference.matches;
		};
		const updateVisibility = () => {
			isDocumentVisible = !document.hidden;
		};
		const observer = new IntersectionObserver(([entry]) => {
			isInView = entry.isIntersecting;
		});
		const surface = element.querySelector('[data-ribbon]');
		const track = element.querySelector('[data-brand-track]');
		const resizeObserver = new ResizeObserver(() => {
			brandAnimation?.cancel();
			if (track)
				brandAnimation = track.animate(
					[
						{ transform: 'translateX(0)' },
						{ transform: `translateX(-${track.scrollWidth / 2}px)` }
					],
					{ duration: 40000, iterations: Infinity, easing: 'linear' }
				);
		});
		if (surface)
			ribbonAnimation = surface.animate(
				[
					{ transform: 'translate(0, 0)' },
					{ transform: 'translate(-14px, 18px)', offset: 0.5 },
					{ transform: 'translate(0, 0)' }
				],
				{ duration: 24000, iterations: Infinity, easing: 'ease-in-out' }
			);
		if (track) resizeObserver.observe(track);
		observer.observe(element);
		updatePreference();
		updateVisibility();
		preference.addEventListener('change', updatePreference);
		document.addEventListener('visibilitychange', updateVisibility);
		return () => {
			observer.disconnect();
			resizeObserver.disconnect();
			preference.removeEventListener('change', updatePreference);
			document.removeEventListener('visibilitychange', updateVisibility);
			brandAnimation?.cancel();
			ribbonAnimation?.cancel();
		};
	};
	onMount(initializeMotion);

	// $props()
	const uid = $props.id();

	// $state
	let brandAnimation = $state.raw<Animation | null>(null);
	let element = $state<HTMLElement | null>(null);
	let isDocumentVisible = $state(true);
	let isInView = $state(true);
	let isPaused = $state(false);
	let isReducedMotion = $state(true);
	let ribbonAnimation = $state.raw<Animation | null>(null);
	let timestamp = $state<number | null>(null);

	// $derived
	const estimatedTotal = $derived(
		productionMetric
			? estimateProduction(productionMetric, timestamp ?? Date.parse(productionMetric.asOf))
			: null
	);
	const isMotionActive = $derived(!isPaused && !isReducedMotion && isDocumentVisible && isInView);

	// $effects
	$effect(() => {
		for (const animation of [brandAnimation, ribbonAnimation]) {
			if (!animation) continue;
			if (isMotionActive) animation.play();
			else {
				animation.pause();
				if (isReducedMotion) animation.currentTime = 0;
			}
		}
	});
	$effect(() => {
		if (!productionMetric) return;
		timestamp = Date.now();
		if (!isMotionActive) return;
		const timer = window.setInterval(() => {
			timestamp = Date.now();
		}, 250);
		return () => window.clearInterval(timer);
	});
</script>

<Section bind:element variants={['hero']} aria-labelledby="hero-heading">
	<Div class={theme.resolve('heroGlow')} aria-hidden="true"></Div>
	<Div class={theme.resolve('heroRibbon')} aria-hidden="true" inert>
		<Svg
			viewBox="0 0 1000 900"
			class="h-full w-full overflow-visible"
			preserveAspectRatio="xMidYMid slice"
		>
			<Defs>
				<LinearGradient id={`${uid}-paper`} x1="0" y1="0" x2="0.8" y2="1">
					<Stop offset="0%" stop-color="var(--color-tag-salmon)" />
					<Stop offset="20%" stop-color="var(--color-tag-orange)" />
					<Stop offset="40%" stop-color="var(--color-abtl-red-400)" />
					<Stop offset="55%" stop-color="var(--color-tag-lilac)" />
					<Stop offset="72%" stop-color="var(--color-abtl-blue-500)" />
					<Stop offset="83%" stop-color="var(--color-tag-blue-light)" />
					<Stop offset="100%" stop-color="var(--color-tag-buff)" />
				</LinearGradient>
				<LinearGradient id={`${uid}-shade`} x1="0" y1="0" x2="1" y2="0.4">
					<Stop offset="0%" stop-color="white" stop-opacity="0.55" />
					<Stop offset="35%" stop-color="white" stop-opacity="0" />
					<Stop offset="100%" stop-color="var(--color-abtl-blue-950)" stop-opacity="0.2" />
				</LinearGradient>
			</Defs>
			<G data-ribbon>
				<Path d={ribbonBand(-1, 1)} fill={`url(#${uid}-paper)`} />
				<Path d={ribbonBand(-1, 1)} fill={`url(#${uid}-shade)`} />
				<Path d={ribbonBand(-0.99, -0.975)} class="fill-white/60" />
				<Path d={ribbonBand(0.8, 0.99)} class="fill-white/10" />
			</G>
		</Svg>
	</Div>
	<Container variants={['hero']}>
		<Div class="max-w-3xl">
			<P variants={['heroDetail']}>
				<Span class="size-2 shrink-0 rounded-full bg-abtl-red-500" aria-hidden="true"></Span>
				{#if estimatedTotal !== null}
					Tags created <Span class="font-semibold text-gray-950 tabular-nums dark:text-gray-50"
						>{formatter.format(estimatedTotal)}</Span
					><Span class="text-xs">Estimated</Span>
				{:else}
					Small format. Big possibilities.
				{/if}
			</P>
			<H1 id="hero-heading" variants={['hero']}
				><Span class="block">Small details.</Span><Span class="block">Big impact.</Span></H1
			>
			<P variants={['heroLead']}
				>Tags and labels that carry your brand, identify what matters, and keep your business
				moving.</P
			>
			<Div class="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-6">
				<A href="#products" variants={['button.base', 'button.variant.heroPrimary']}
					>Explore Products <ArrowRight aria-hidden="true" class="size-5" /></A
				>
				<A
					href="mailto:sales@abtl.com?subject=Custom%20tag%20and%20label%20quote"
					variants={['button.base', 'button.variant.heroSecondary']}
					>Request a Quote <ArrowRight aria-hidden="true" class="size-5" /></A
				>
			</Div>
			<P variants={['heroFootnote']}
				>Stock tags. Custom tags. Labels. Made for your next big thing.</P
			>
		</Div>
	</Container>
	<Container>
		<Div class={theme.resolve('heroBrand')}>
			<Div
				class="min-w-0 flex-1 overflow-hidden mask-x-from-90% mask-x-to-100%"
				aria-hidden="true"
				inert
			>
				<Div data-brand-track class="flex w-max">
					{#each [0, 1] as repeat (repeat)}
						<Div class="flex items-center gap-10 pr-10 sm:gap-16 sm:pr-16">
							{#each words as word (word)}
								<Span
									class="text-xl font-semibold tracking-tight text-gray-400 sm:text-2xl dark:text-gray-500"
									>{word}</Span
								>
								<Svg viewBox="0 0 24 14" class="h-auto w-8 shrink-0 fill-abtl-red-500/60"
									><Path d={redPath} /></Svg
								>
							{/each}
						</Div>
					{/each}
				</Div>
			</Div>
			<Button
				type="button"
				variants={['ghost', 'icon']}
				class="shrink-0 text-gray-500 dark:text-gray-400"
				disabled={isReducedMotion}
				aria-label={isPaused || isReducedMotion ? 'Play hero animation' : 'Pause hero animation'}
				aria-pressed={isPaused}
				onclick={() => {
					isPaused = !isPaused;
				}}
			>
				{#if isPaused || isReducedMotion}<Play class="size-4" aria-hidden="true" />{:else}<Pause
						class="size-4"
						aria-hidden="true"
					/>{/if}
			</Button>
		</Div>
	</Container>
</Section>
