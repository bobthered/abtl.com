<script lang="ts">
	// Imports
	import {
		A,
		Button,
		Container,
		Div,
		H1,
		P,
		Path,
		Section,
		Span,
		Svg,
		TagRain
	} from '#lib/components';
	import { ArrowRight, Pause, Play } from '#lib/icons';
	import { estimateAnnualProduction } from '#lib/productionMetric.js';
	import { onMount } from 'svelte';
	import { redPath } from '../Logo/paths';
	import { theme } from 'sveltewind/theme';

	// consts
	const formatter = new Intl.NumberFormat('en-US');
	const words = ['Identify.', 'Organize.', 'Inform.', 'Connect.'];

	// helpers
	const initializeMotion = () => {
		if (!element) return;
		timestamp = Date.now();
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => {
			isReducedMotion = preference.matches;
		};
		const updateVisibility = () => {
			isDocumentVisible = !document.hidden;
		};
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === element) isInView = entry.isIntersecting;
				if (entry.target === brandElement) isMarqueeInView = entry.isIntersecting;
			}
		});
		const track = brandElement?.querySelector('[data-brand-track]');
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
		if (track) resizeObserver.observe(track);
		observer.observe(element);
		if (brandElement) observer.observe(brandElement);
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
		};
	};
	onMount(initializeMotion);

	// $state
	let brandAnimation = $state.raw<Animation | null>(null);
	let brandElement = $state<HTMLElement | null>(null);
	let element = $state<HTMLElement | null>(null);
	let isDocumentVisible = $state(true);
	let isInView = $state(true);
	let isMarqueeInView = $state(true);
	let isPaused = $state(false);
	let isReducedMotion = $state(true);
	let timestamp = $state<number | null>(null);

	// $derived
	const estimatedTotal = $derived(timestamp === null ? null : estimateAnnualProduction(timestamp));
	const isBrandMotionActive = $derived(
		!isPaused && !isReducedMotion && isDocumentVisible && isMarqueeInView
	);
	const isMotionActive = $derived(!isPaused && !isReducedMotion && isDocumentVisible && isInView);

	// $effects
	$effect(() => {
		if (!isMotionActive) return;
		timestamp = Date.now();
		const timer = window.setInterval(() => {
			timestamp = Date.now();
		}, 250);
		return () => window.clearInterval(timer);
	});
	$effect(() => {
		for (const animation of [brandAnimation]) {
			if (!animation) continue;
			if (isBrandMotionActive) animation.play();
			else {
				animation.pause();
				if (isReducedMotion) animation.currentTime = 0;
			}
		}
	});
</script>

<Section bind:element variants={['hero']} aria-labelledby="hero-heading" data-tag-hero>
	<TagRain isActive={isMotionActive} />
	<Container variants={['hero']}>
		<Div
			data-tag-drop-zone
			aria-hidden="true"
			inert
			class="absolute inset-y-0 right-6 w-2/5 sm:right-8 lg:right-16 lg:w-1/3"
		/>
		<Div variants={['heroCopy']} data-hero-copy>
			<Div>
				<P
					variants={['heroMetric']}
					title="Estimated at a steady pace toward 90 million tags by the end of 2026."
				>
					<Span variants={['heroText']}>
						Customer tags this year:
						<Span variants={['productionTotal']} data-production-counter aria-live="off">
							{estimatedTotal === null ? 'Calculating...' : formatter.format(estimatedTotal)}
						</Span>
					</Span>
				</P>
				<H1 id="hero-heading" variants={['hero']}>
					<Span class="block"><Span variants={['heroText']}>Built for</Span></Span>
					<Span class="block"><Span variants={['heroText']}>Endless possibilities.</Span></Span>
				</H1>
				<P variants={['heroLead']}>
					<Span variants={['heroText']}>
						Every tag has a job to do. We produced over 90 million in the last year, helping
						businesses identify, organize, and keep things moving. What can we make for yours?
					</Span>
				</P>
				<Div class="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-6">
					<A
						href="mailto:sales@abtl.com?subject=Tag%20project%20quote"
						variants={['button.base', 'button.variant.heroPrimary']}
					>
						Get a quote <ArrowRight aria-hidden="true" class="size-4" />
					</A>
					<A href="#products" variants={['button.base', 'button.variant.heroSecondary']}>
						Find your tags <ArrowRight aria-hidden="true" class="size-4" />
					</A>
				</Div>
				<P variants={['heroFootnote']}>
					<Span variants={['heroText']}>Stock tags. Custom tags. A place for every detail.</Span>
				</P>
			</Div>
		</Div>
	</Container>
</Section>

<Section
	bind:element={brandElement}
	variants={['heroMarquee']}
	data-hero-marquee
	aria-label="Allen-Bailey brand"
>
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
