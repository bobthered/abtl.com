<script lang="ts">
	// Imports
	import {
		A,
		BentoItem,
		Button,
		Container,
		Div,
		H2,
		H3,
		Img,
		P,
		Section,
		Span
	} from '#lib/components';
	import { ChevronLeft, ChevronRight } from '#lib/icons';
	import { MediaQuery } from 'svelte/reactivity';
	import NewsDialog from './NewsDialog.svelte';
	import { newsHighlights, type NewsPost } from '#lib/data/news.js';
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
	const expandImage = (index: number | null) => {
		if (!track || isAnimating || visibleCount < 2) return;
		const nodes = [...track.children] as HTMLElement[];
		const starts = nodes.map((node) => getComputedStyle(node).flexGrow);
		hoverAnimations.forEach((animation) => animation.cancel());
		const weights = nodes.map((_, position) =>
			position < visibleCount ? (1 / imageRatio) ** position : 0
		);
		const total = weights.reduce((sum, weight) => sum + weight, 0);
		const gap = parseFloat(getComputedStyle(nodes[0]).marginRight);
		const available = track.clientWidth - gap * (visibleCount - 1);
		if (available <= 0) return;
		const extra =
			((2 * parseFloat(getComputedStyle(document.documentElement).fontSize)) / available) * total;
		const targets = weights.map((weight, position) =>
			index === null
				? weight
				: position === index
					? weight + extra
					: weight - (extra * weight) / (total - weights[index])
		);
		hoverAnimations = nodes.map((node, position) =>
			node.animate(
				[{ flexGrow: starts[position] }, { flexGrow: String(Math.max(0, targets[position])) }],
				{ duration: isReducedMotion.current ? 0 : 300, easing: 'ease-out', fill: 'both' }
			)
		);
	};
	const move = async (direction: number) => {
		if (isAnimating || !track) return;
		const focusedImage =
			document.activeElement?.closest<HTMLElement>('[data-news-image]')?.dataset.newsImage;
		// Continue from the current hover widths instead of snapping back before moving.
		const starts = new Map(
			[...track.children].map((node) => [
				node,
				{
					flexGrow: getComputedStyle(node).flexGrow,
					marginRight: getComputedStyle(node).marginRight
				}
			])
		);
		// Hold the exact rendered widths across decoding and any keyed DOM reorder.
		// Cancelling hover first would expose the base widths for one or more frames.
		const holds = [...track.children].map((node) =>
			node.animate([starts.get(node)!], { duration: 0, fill: 'both' })
		);
		hoverAnimations.forEach((animation) => animation.cancel());
		hoverAnimations = holds;
		isAnimating = true;
		const count = visibleCount;
		const steps = direction > 0 ? Math.min(direction, order.length - 1) : 1;
		if (newsHighlights.length < 2) {
			isAnimating = false;
			return;
		}
		const gap = parseFloat(getComputedStyle(track.firstElementChild!).marginRight);
		const margin = (index: number) => (index >= 0 && index < count - 1 ? `${gap}px` : '0px');
		const weight = (index: number) => (index >= 0 && index < count ? (1 / imageRatio) ** index : 0);
		if (direction < 0) order = [order[order.length - 1], ...order.slice(0, -1)];
		await tick();
		// Decode incoming artwork before growing its slot, including wrapped copies.
		await Promise.all(
			[...track.querySelectorAll('img')].map((image) => image.decode().catch(() => undefined))
		);
		if (isDisposed) return;
		if (!isReducedMotion.current) {
			animations = [...track.children].map((node, index) =>
				node.animate(
					[
						starts.get(node) ?? {
							flexGrow: String(weight(direction > 0 ? index : index - 1)),
							marginRight: margin(direction > 0 ? index : index - 1)
						},
						{
							flexGrow: String(weight(direction > 0 ? index - steps : index)),
							marginRight: margin(direction > 0 ? index - steps : index)
						}
					],
					{ duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' }
				)
			);
			hoverAnimations.forEach((animation) => animation.cancel());
			hoverAnimations = [];
			await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
		}
		if (isDisposed) return;
		if (direction > 0) order = [...order.slice(steps), ...order.slice(0, steps)];
		selected = order[0];
		await tick();
		animations.forEach((animation) => animation.cancel());
		animations = [];
		hoverAnimations.forEach((animation) => animation.cancel());
		hoverAnimations = [];
		if (focusedImage)
			track
				.querySelector<HTMLElement>(`[data-news-image="${focusedImage}"] button`)
				?.focus({ preventScroll: true });
		// Focus restoration belongs to the handoff, not a fresh hover resize.
		await tick();
		isAnimating = false;
	};
	const openPost = (event: MouseEvent, post: NewsPost) => {
		if (
			isAnimating ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			!onNavigate
		)
			return;
		event.preventDefault();
		onNavigate(post);
	};

	// $props()
	let {
		onNavigate,
		postId
	}: { onNavigate?: (post: NewsPost | null) => void; postId?: string | null } = $props();

	// $state
	let animations = $state.raw<Animation[]>([]);
	let hoverAnimations = $state.raw<Animation[]>([]);
	let isAnimating = $state(false);
	let isDisposed = $state(false);
	let order = $state(newsHighlights);
	let selected = $state(newsHighlights[0]);
	let track = $state<HTMLDivElement | null>(null);

	// $derived
	// Resolve the responsive slot count before deriving the loop entries that depend on it.
	const visibleCount = $derived(
		Math.min(newsHighlights.length, isDesktop.current ? 5 : isTablet.current ? 3 : 2)
	);

	// Extra loop entries fill every incoming slot during a multi-image advance.
	// Their own motion replaces scroll reveals, so incoming copies do not fade in late.
	const renderedStories = $derived([
		...order.map((post) => ({ isCopy: false, key: post.id, post })),
		...order
			.slice(0, Math.max(0, visibleCount - 1))
			.map((post) => ({ isCopy: true, key: `copy-${post.id}`, post }))
	]);

	// $effects
	$effect(() => {
		// Finish an active resize/reduced-motion transition with the new responsive layout.
		void visibleCount;
		void isReducedMotion.current;
		untrack(() => {
			animations.forEach((animation) => animation.finish());
			hoverAnimations.forEach((animation) => animation.cancel());
			hoverAnimations = [];
		});
	});
	onDestroy(() => {
		isDisposed = true;
		hoverAnimations.forEach((animation) => animation.cancel());
		animations.forEach((animation) => animation.cancel());
	});
</script>

{#snippet image(story: NewsPost)}
	<Div class="flex h-full w-full items-center justify-center overflow-hidden rounded-sm">
		<Img
			src={story.image}
			alt={story.alt}
			class="h-auto w-160 max-w-none shrink-0 sm:w-192 lg:w-256"
			loading={isAnimating ? 'eager' : 'lazy'}
			decoding="async"
		/>
	</Div>
{/snippet}

{#if selected}
	<Section variants={['surface']} aria-labelledby={`${uid}-heading`} data-news-highlights>
		<Container variants={['section']}>
			<Div class="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-12">
				<Div class="max-w-2xl">
					<P class="mb-4 text-sm font-semibold text-primary-600 dark:text-primary-300">
						From the newsroom
					</P>
					<H2 id={`${uid}-heading`} variants={['section']}>
						The latest, with a little perspective.
					</H2>
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
					<Span class="mr-3 text-sm text-gray-500 tabular-nums dark:text-gray-400">
						{newsHighlights.findIndex((story) => story.id === selected.id) + 1} / {newsHighlights.length}
					</Span>
					<Button
						variants={['neutral-outline', 'icon']}
						aria-label="Previous article"
						aria-controls={`${uid}-images ${uid}-story`}
						aria-disabled={isAnimating || newsHighlights.length < 2}
						onclick={() => void move(-1)}
					>
						<ChevronLeft class="size-5" aria-hidden="true" />
					</Button>
					<Button
						variants={['neutral-outline', 'icon']}
						aria-label="Next article"
						aria-controls={`${uid}-images ${uid}-story`}
						aria-disabled={isAnimating || newsHighlights.length < 2}
						onclick={() => void move(1)}
					>
						<ChevronRight class="size-5" aria-hidden="true" />
					</Button>
				</Div>
				<!-- Reveal the stationary wrapper once; moving images handle their own transitions. -->
				<Div data-scroll-reveal data-news-images-reveal>
					<Div
						id={`${uid}-images`}
						bind:element={track}
						class="flex h-64 sm:h-80 lg:h-96"
						data-scroll-reveal="off"
						data-news-track
					>
						{#each renderedStories as entry, index (entry.key)}
							{@const story = entry.post}
							<Div
								class={`flex min-w-0 basis-0 items-center justify-center ${index >= visibleCount && !isAnimating ? 'invisible' : ''} ${proportions[index] ?? 'grow-0'} ${index < visibleCount - 1 ? 'mr-4' : 'mr-0'}`}
								aria-hidden={index >= visibleCount}
								inert={index >= visibleCount}
								onpointerenter={(event) => {
									if (event.pointerType !== 'touch') expandImage(index);
								}}
								onpointerleave={() => expandImage(null)}
								onfocusin={() => expandImage(index)}
								onfocusout={() => expandImage(null)}
								data-news-image={entry.isCopy ? undefined : story.id}
								data-news-copy={entry.isCopy ? story.id : undefined}
							>
								{#if index === 0}
									<BentoItem
										aria-label={`Read ${story.title}`}
										aria-haspopup="dialog"
										aria-disabled={isAnimating}
										class="w-full"
										onclick={(event) => openPost(event, story)}
									>
										{@render image(story)}
									</BentoItem>
								{:else}
									<Button
										type="button"
										variants={['ghost']}
										aria-label={`Select ${story.title}`}
										aria-controls={`${uid}-story`}
										aria-disabled={isAnimating}
										class="h-full w-full overflow-hidden rounded-sm p-0"
										onclick={() => void move(index)}
									>
										{@render image(story)}
									</Button>
								{/if}
							</Div>
						{/each}
					</Div>
				</Div>
				<Div class="mt-8 sm:mt-10">
					<Div
						id={`${uid}-story`}
						class="max-w-2xl"
						aria-live="polite"
						aria-atomic="true"
						data-news-story
					>
						<P class="mb-3 text-sm font-semibold text-primary-600 dark:text-primary-300">
							{selected.category}
							{#if !selected.isPublished}
								<Span class="font-normal text-gray-500 dark:text-gray-400">/ Preview</Span>
							{/if}
						</P>
						<H3 class="text-2xl font-semibold tracking-tight sm:text-3xl">
							<A
								href={`/news/${selected.id}`}
								onclick={(event) => openPost(event, selected)}
								aria-haspopup="dialog"
								class="text-inherit hover:text-primary-600 dark:hover:text-primary-300"
							>
								{selected.title}
							</A>
						</H3>
						<P class="mt-4 text-base text-gray-600 sm:text-lg dark:text-gray-300">
							{selected.description}
						</P>
						<A
							href={`/news/${selected.id}`}
							onclick={(event) => openPost(event, selected)}
							aria-haspopup="dialog"
							class="mt-5 inline-flex"
							variants={['button.base']}
						>
							Read article
						</A>
					</Div>
				</Div>
			</Div>
		</Container>
	</Section>
{/if}

<NewsDialog {postId} {onNavigate} />
