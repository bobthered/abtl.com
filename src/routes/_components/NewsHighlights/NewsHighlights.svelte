<script lang="ts">
	// Imports
	import { A, Button, Container, Div, H2, H3, Img, P, Section, Span } from '#lib/components';
	import { ChevronLeft, ChevronRight } from '#lib/icons';
	import { MediaQuery } from 'svelte/reactivity';
	import { newsHighlights } from '#lib/data/news.js';
	import { onDestroy, tick, untrack } from 'svelte';

	// consts
	const imageRatio = 1 + Math.sqrt(5);
	const isDesktop = new MediaQuery('(min-width: 64rem)');
	const isReducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)');
	const isTablet = new MediaQuery('(min-width: 40rem)');
	// Twice the golden ratio; precise proportions require values outside Tailwind's standard fractions.
	const proportions = [
		'grow-[1]',
		'grow-[0.309017]',
		'grow-0 sm:grow-[0.095492]',
		'grow-0 lg:grow-[0.0295085]',
		'grow-0 lg:grow-[0.00911863]',
		'grow-0'
	];
	const uid = $props.id();

	// helpers
	const move = async (direction: number) => {
		if (isAnimating || !track) return;
		isAnimating = true;
		const count = visibleCount;
		if (newsHighlights.length < 2) {
			isAnimating = false;
			return;
		}
		const gap = parseFloat(getComputedStyle(track.firstElementChild!).marginRight);
		const margin = (index: number) => (index >= 0 && index < count - 1 ? `${gap}px` : '0px');
		const weight = (index: number) => (index >= 0 && index < count ? (1 / imageRatio) ** index : 0);
		if (direction < 0) {
			order = [order[order.length - 1], ...order.slice(0, -1)];
			await tick();
		}
		if (!isReducedMotion.current) {
			animations = [...track.children].map((node, index) =>
				node.animate(
					[
						{
							flexGrow: String(weight(direction > 0 ? index : index - 1)),
							marginRight: margin(direction > 0 ? index : index - 1)
						},
						{
							flexGrow: String(weight(direction > 0 ? index - 1 : index)),
							marginRight: margin(direction > 0 ? index - 1 : index)
						}
					],
					{ duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' }
				)
			);
			await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
		}
		if (isDisposed) return;
		if (direction > 0) order = [...order.slice(1), order[0]];
		selected = order[0];
		await tick();
		animations.forEach((animation) => animation.cancel());
		animations = [];
		isAnimating = false;
	};

	// $state
	let animations = $state.raw<Animation[]>([]);
	let isAnimating = $state(false);
	let isDisposed = $state(false);
	let order = $state(newsHighlights);
	let selected = $state(newsHighlights[0]);
	let track = $state<HTMLDivElement | null>(null);

	// $derived
	const visibleCount = $derived(
		Math.min(newsHighlights.length, isDesktop.current ? 5 : isTablet.current ? 3 : 2)
	);

	// $effects
	$effect(() => {
		// Finish an active resize/reduced-motion transition with the new responsive layout.
		void visibleCount;
		void isReducedMotion.current;
		untrack(() => animations.forEach((animation) => animation.finish()));
	});
	onDestroy(() => {
		isDisposed = true;
		animations.forEach((animation) => animation.cancel());
	});
</script>

{#if selected}
	<Section variants={['surface']} aria-labelledby={`${uid}-heading`} data-news-highlights>
		<Container variants={['section']}>
			<Div class="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-12">
				<Div class="max-w-2xl">
					<P class="mb-4 text-sm font-semibold text-primary-600 dark:text-primary-300"
						>From the newsroom</P
					>
					<H2 id={`${uid}-heading`} variants={['section']}
						>The latest, with a little perspective.</H2
					>
				</Div>
				<A href="/news" variants={['button.base', 'button.variant.neutral-outline']}>All news</A>
			</Div>
			<Div
				role="region"
				aria-roledescription="carousel"
				aria-label="News highlights"
				onkeydown={(event) => {
					if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
						event.preventDefault();
						void move(event.key === 'ArrowRight' ? 1 : -1);
					}
				}}
			>
				<Div
					class="mb-6 flex items-center justify-end gap-3"
					role="group"
					aria-label="News highlight controls"
				>
					<Span class="mr-3 text-sm text-gray-500 tabular-nums dark:text-gray-400"
						>{newsHighlights.findIndex((story) => story.id === selected.id) + 1} / {newsHighlights.length}</Span
					>
					<Button
						variants={['neutral-outline', 'icon']}
						aria-label="Previous article"
						aria-controls={`${uid}-images ${uid}-story`}
						aria-disabled={isAnimating || newsHighlights.length < 2}
						onclick={() => void move(-1)}><ChevronLeft class="size-5" aria-hidden="true" /></Button
					>
					<Button
						variants={['neutral-outline', 'icon']}
						aria-label="Next article"
						aria-controls={`${uid}-images ${uid}-story`}
						aria-disabled={isAnimating || newsHighlights.length < 2}
						onclick={() => void move(1)}><ChevronRight class="size-5" aria-hidden="true" /></Button
					>
				</Div>
				<Div
					id={`${uid}-images`}
					bind:element={track}
					class="flex h-64 sm:h-80 lg:h-96"
					data-news-track
				>
					{#each order as story, index (story.id)}
						<Div
							class={`flex min-w-0 basis-0 items-center justify-center overflow-hidden rounded-sm ${proportions[index]} ${index < visibleCount - 1 ? 'mr-4' : 'mr-0'}`}
							aria-hidden={index >= visibleCount}
							data-news-image={story.id}
						>
							<Img
								src={story.image}
								alt={story.alt}
								class="h-auto w-160 max-w-none shrink-0 sm:w-192 lg:w-256"
								loading="lazy"
								decoding="async"
							/>
						</Div>
					{/each}
				</Div>
				<Div class="mt-8 sm:mt-10">
					<Div
						id={`${uid}-story`}
						class="max-w-2xl"
						aria-live="polite"
						aria-atomic="true"
						data-news-story
					>
						<P class="mb-3 text-sm font-semibold text-primary-600 dark:text-primary-300"
							>{selected.category}
							{#if !selected.isPublished}<Span class="font-normal text-gray-500 dark:text-gray-400"
									>/ Preview</Span
								>{/if}</P
						>
						<H3 class="text-2xl font-semibold tracking-tight sm:text-3xl"
							><A
								href={`/news/${selected.id}`}
								class="text-inherit hover:text-primary-600 dark:hover:text-primary-300"
								>{selected.title}</A
							></H3
						>
						<P class="mt-4 text-base text-gray-600 sm:text-lg dark:text-gray-300"
							>{selected.description}</P
						>
						<A
							href={`/news/${selected.id}`}
							class="mt-5 inline-flex"
							variants={['button.base', 'button.variant.ghost']}>Read article</A
						>
					</Div>
				</Div>
			</Div>
		</Container>
	</Section>
{/if}
