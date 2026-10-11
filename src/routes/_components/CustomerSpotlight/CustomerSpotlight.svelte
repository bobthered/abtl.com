<script lang="ts">
	// Imports
	import { Button, Container, Div, H2, H3, Img, P, Section, Span } from '#lib/components';
	import { ChevronLeft, ChevronRight } from '#lib/icons';
	import { MediaQuery } from 'svelte/reactivity';
	import { onDestroy, tick, untrack } from 'svelte';
	import { stories } from './stories';

	// consts
	const isDesktop = new MediaQuery('(min-width: 64rem)');
	const isReducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)');
	const isTablet = new MediaQuery('(min-width: 40rem)');
	// Exact golden-ratio proportions are intentionally more precise than Tailwind's standard fractions.
	const proportions = [
		'grow-[1]',
		'grow-[0.618034]',
		'grow-0 sm:grow-[0.381966]',
		'grow-0 lg:grow-[0.236068]',
		'grow-0 lg:grow-[0.145898]',
		'grow-0'
	];
	const uid = $props.id();

	// helpers
	const move = async (direction: number) => {
		if (isAnimating || !track) return;
		isAnimating = true;
		const count = visibleCount;
		const weight = (index: number) =>
			index >= 0 && index < count ? (1 / ((1 + Math.sqrt(5)) / 2)) ** index : 0;
		if (direction < 0) {
			order = [order[order.length - 1], ...order.slice(0, -1)];
			await tick();
		}
		if (!isReducedMotion.current) {
			animations = [...track.children].map((node, index) =>
				node.animate(
					[
						{ flexGrow: String(weight(direction > 0 ? index : index - 1)) },
						{ flexGrow: String(weight(direction > 0 ? index - 1 : index)) }
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
	let order = $state(stories);
	let selected = $state(stories[0]);
	let track = $state<HTMLDivElement | null>(null);

	// $derived
	const visibleCount = $derived(isDesktop.current ? 5 : isTablet.current ? 3 : 2);

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

<Section variants={['surface']} aria-labelledby={`${uid}-heading`} data-customer-spotlight>
	<Container variants={['section']}>
		<Div class="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-12">
			<Div class="max-w-2xl">
				<P class="mb-4 text-sm font-semibold text-primary-600 dark:text-primary-300"
					>Customer spotlight</P
				>
				<H2 id={`${uid}-heading`} variants={['section']}>Behind every tag, a bigger story.</H2>
			</Div>
			<P class="text-sm text-gray-500 dark:text-gray-400"
				>Preview stories / Customer features coming soon</P
			>
		</Div>
		<Div
			role="region"
			aria-roledescription="carousel"
			aria-label="Customer spotlights"
			onkeydown={(event) => {
				if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
					event.preventDefault();
					void move(event.key === 'ArrowRight' ? 1 : -1);
				}
			}}
		>
			<Div
				id={`${uid}-images`}
				bind:element={track}
				class="-mx-1.5 flex h-64 sm:h-80 lg:h-96"
				data-spotlight-track
			>
				{#each order as story, index (story.id)}
					<Div
						class={`min-w-0 basis-0 overflow-hidden ${proportions[index]}`}
						aria-hidden={index >= visibleCount}
						data-spotlight-image={story.id}
					>
						<Div class="h-full px-1.5">
							<Img
								src={story.image}
								alt={story.alt}
								class="h-full w-full rounded-sm object-cover"
								loading="lazy"
								decoding="async"
							/>
						</Div>
					</Div>
				{/each}
			</Div>
			<Div class="mt-8 flex flex-col justify-between gap-8 sm:mt-10 sm:flex-row sm:items-end">
				<Div
					id={`${uid}-story`}
					class="max-w-2xl"
					aria-live="polite"
					aria-atomic="true"
					data-spotlight-story
				>
					<P class="mb-3 text-sm font-semibold text-primary-600 dark:text-primary-300"
						>{selected.category}
						<Span class="font-normal text-gray-500 dark:text-gray-400">/ Preview</Span></P
					>
					<H3 class="text-2xl font-semibold tracking-tight sm:text-3xl">{selected.title}</H3>
					<P class="mt-4 text-base text-gray-600 sm:text-lg dark:text-gray-300"
						>{selected.description}</P
					>
				</Div>
				<Div
					class="flex shrink-0 items-center gap-3"
					role="group"
					aria-label="Customer spotlight controls"
				>
					<Span class="mr-3 text-sm text-gray-500 tabular-nums dark:text-gray-400"
						>{stories.findIndex((story) => story.id === selected.id) + 1} / {stories.length}</Span
					>
					<Button
						variants={['neutral-outline', 'icon']}
						aria-label="Previous customer"
						aria-controls={`${uid}-images ${uid}-story`}
						aria-disabled={isAnimating}
						onclick={() => void move(-1)}><ChevronLeft class="size-5" aria-hidden="true" /></Button
					>
					<Button
						variants={['neutral-outline', 'icon']}
						aria-label="Next customer"
						aria-controls={`${uid}-images ${uid}-story`}
						aria-disabled={isAnimating}
						onclick={() => void move(1)}><ChevronRight class="size-5" aria-hidden="true" /></Button
					>
				</Div>
			</Div>
		</Div>
	</Container>
</Section>
