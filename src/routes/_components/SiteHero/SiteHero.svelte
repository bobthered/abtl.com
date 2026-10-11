<script lang="ts">
	// Imports
	import { A, Container, Div, H1, Marquee, P, Path, Section, Span, Svg } from '#lib/components';
	import { ArrowRight } from '#lib/icons';
	import { estimateAnnualProduction } from '#lib/productionMetric.js';
	import { onMount } from 'svelte';
	import { redPath } from '../../../lib/components/Logo/paths';
	import TagRain from '../TagRain/TagRain.svelte';

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
			}
		});
		observer.observe(element);
		updatePreference();
		updateVisibility();
		preference.addEventListener('change', updatePreference);
		document.addEventListener('visibilitychange', updateVisibility);
		return () => {
			observer.disconnect();
			preference.removeEventListener('change', updatePreference);
			document.removeEventListener('visibilitychange', updateVisibility);
		};
	};
	onMount(initializeMotion);

	// $state
	let element = $state<HTMLElement | null>(null);
	let isDocumentVisible = $state(true);
	let isInView = $state(true);
	let isReducedMotion = $state(true);
	let timestamp = $state<number | null>(null);

	// $derived
	const estimatedTotal = $derived(timestamp === null ? null : estimateAnnualProduction(timestamp));
	const isMotionActive = $derived(!isReducedMotion && isDocumentVisible && isInView);

	// $effects
	$effect(() => {
		if (!isMotionActive) return;
		timestamp = Date.now();
		const timer = window.setInterval(() => {
			timestamp = Date.now();
		}, 250);
		return () => window.clearInterval(timer);
	});
</script>

<Section bind:element variants={['hero', 'surface']} aria-labelledby="hero-heading" data-tag-hero>
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
					<A href="mailto:sales@abtl.com?subject=Tag%20project%20quote" variants={['button.base']}>
						Get a quote <ArrowRight aria-hidden="true" class="size-4" />
					</A>
					<A href="#possibilities" variants={['button.base', 'button.variant.neutral-outline']}>
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
	variants={['heroMarquee', 'surfaceAlternate']}
	data-hero-marquee
	aria-label="Allen-Bailey brand"
>
	<Container>
		<Marquee
			ariaLabel="Brand marquee"
			items={words}
			isRandomStart={false}
			pixelsPerSecond={24}
			class="mask-x-from-90% mask-x-to-100%"
		>
			{#snippet renderItem(word)}
				<Div class="flex items-center gap-4">
					<Span
						class="text-xl font-semibold tracking-tight text-gray-400 sm:text-2xl dark:text-gray-500"
						>{word}</Span
					>
					<Svg
						viewBox="0 0 24 14"
						class="h-auto w-8 shrink-0 fill-abtl-red-500/60"
						aria-hidden="true"><Path d={redPath} /></Svg
					>
				</Div>
			{/snippet}
		</Marquee>
	</Container>
</Section>
