<script lang="ts">
	// Imports
	import { Button, Card, Container, Dialog, Div } from '#lib/components';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { dismissOutside } from '#lib/attachments';
	import { fade, fly } from 'svelte/transition';
	import { newsHighlights, type NewsPost } from '#lib/data/news.js';
	import NewsPostContent from '../../news/[slug]/_components/NewsPostContent.svelte';
	import { onMount, tick, untrack } from 'svelte';
	import { X } from '#lib/icons';

	// helpers
	const closeDialog = () => {
		isDialogVisible = false;
	};
	const initializeMotion = () => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => {
			isReducedMotion = preference.matches;
		};
		const updateViewport = () => {
			viewportHeight = window.innerHeight;
		};
		updatePreference();
		updateViewport();
		preference.addEventListener('change', updatePreference);
		window.addEventListener('resize', updateViewport);
		return () => {
			preference.removeEventListener('change', updatePreference);
			window.removeEventListener('resize', updateViewport);
		};
	};
	const revealDialog = async (post: NewsPost) => {
		isCardVisible = false;
		selectedPost = post;
		isDialogVisible = true;
		// Mount the overlay first so Card's local visibility transition runs on every opening.
		await tick();
		isCardVisible = true;
		await tick();
		// Focusing a translated card must not scroll the overlay to its animated position.
		dialogElement
			?.querySelector<HTMLButtonElement>('[data-news-close]')
			?.focus({ preventScroll: true });
	};
	onMount(initializeMotion);

	// $props()
	let {
		onNavigate,
		postId
	}: {
		onNavigate?: (post: NewsPost | null) => void;
		postId?: string | null;
	} = $props();

	// $state
	let dialogElement = $state<HTMLDialogElement | null>(null);
	let isCardVisible = $state(false);
	let isDialogVisible = $state(false);
	let isReducedMotion = $state(true);
	let selectedPost = $state<NewsPost | null>(null);
	let viewportHeight = $state(800);

	// $effects
	$effect(() => {
		const routedPostId = postId;
		if (routedPostId === undefined) return;
		untrack(() => {
			const post = newsHighlights.find((item) => item.id === routedPostId);
			if (post) void revealDialog(post);
			else isDialogVisible = false;
		});
	});
	$effect(() => {
		// Sveltewind also changes visibility on native Escape/cancel events.
		// Synchronize every dismissal with the shallow route in one place.
		if (postId && selectedPost && !isDialogVisible) untrack(() => onNavigate?.(null));
	});
	$effect(() => {
		// Keep the page locked through the exit transition, until Dialog removes its element.
		if (!dialogElement) return;
		const root = document.documentElement;
		const isAlreadyLocked = root.classList.contains('overflow-hidden');
		root.classList.add('overflow-hidden');
		return () => {
			if (!isAlreadyLocked) root.classList.remove('overflow-hidden');
		};
	});
</script>

<Dialog
	{@attach dismissOutside({ contentSelector: '[data-news-card]', onDismiss: closeDialog })}
	bind:element={dialogElement}
	bind:isVisible={isDialogVisible}
	variants={['bento']}
	inTransition={[fade, { duration: isReducedMotion ? 0 : 200 }]}
	outTransition={[fade, { duration: isReducedMotion ? 0 : 250 }]}
	aria-labelledby="news-dialog-heading"
	data-news-dialog
>
	{#if selectedPost}
		<Container class="py-8 sm:py-16">
			<Card
				isVisible={isCardVisible}
				class="px-6 pt-0 pb-12 sm:px-8 sm:pb-16 lg:px-16"
				data-news-card
				inTransition={[
					fly,
					{ y: viewportHeight, duration: isReducedMotion ? 0 : 500, easing: cubicOut }
				]}
				outTransition={[
					fly,
					{ y: viewportHeight, duration: isReducedMotion ? 0 : 250, easing: cubicIn }
				]}
			>
				<Div variants={['dialogClose']}>
					<Button
						type="button"
						variants={['neutral', 'icon']}
						aria-label="Close article"
						onclick={closeDialog}
						data-scroll-reveal="off"
						data-news-close><X class="size-5" aria-hidden="true" /></Button
					>
				</Div>
				<NewsPostContent post={selectedPost} headingId="news-dialog-heading" />
			</Card>
		</Container>
	{/if}
</Dialog>
