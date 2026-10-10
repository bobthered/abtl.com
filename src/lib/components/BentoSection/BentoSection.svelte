<script lang="ts">
	// Imports
	import {
		BentoItem,
		BentoPreview,
		BentoTopicContent,
		Button,
		Card,
		Container,
		Dialog,
		Div,
		Section
	} from '#lib/components';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { dismissOutside } from '#lib/attachments';
	import { fade, fly } from 'svelte/transition';
	import { onMount, tick, untrack } from 'svelte';
	import { type Topic, topicHref, topics } from './topics';
	import { X } from '#lib/icons';

	// consts
	const columnClasses = {
		full: 'sm:col-span-2 lg:col-span-6',
		third: 'lg:col-span-2',
		wide: 'sm:col-span-2 lg:col-span-4'
	};

	// helpers
	const closeDialog = () => {
		if (onNavigate) onNavigate(null);
		else isDialogVisible = false;
	};
	const handleDialogCancel = (element: Element) => {
		element.addEventListener('cancel', closeDialog);
		return () => element.removeEventListener('cancel', closeDialog);
	};
	const initializeMotion = () => {
		isReady = true;
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
	const openDialog = (event: MouseEvent, topic: Topic) => {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
			return;
		event.preventDefault();
		if (onNavigate) onNavigate(topic);
		else void revealDialog(topic);
	};
	const revealDialog = async (topic: Topic) => {
		isCardVisible = false;
		selectedTopic = topic;
		isDialogVisible = true;
		// Mount the overlay first so Card's local visibility transition runs on every opening.
		await tick();
		isCardVisible = true;
		await tick();
		// Focusing a translated card must not scroll the overlay to its animated position.
		dialogElement
			?.querySelector<HTMLButtonElement>('[data-bento-close]')
			?.focus({ preventScroll: true });
	};
	onMount(initializeMotion);

	// $props()
	let {
		onNavigate,
		topicId
	}: { onNavigate?: (topic: Topic | null) => void; topicId?: string | null } = $props();

	// $state
	let dialogElement = $state<HTMLDialogElement | null>(null);
	let isCardVisible = $state(false);
	let isDialogVisible = $state(false);
	let isReady = $state(false);
	let isReducedMotion = $state(true);
	let selectedTopic = $state<Topic | null>(null);
	let viewportHeight = $state(800);

	// $effects
	$effect(() => {
		const routedTopicId = topicId;
		if (routedTopicId === undefined) return;
		untrack(() => {
			const topic = topics.find((item) => item.id === routedTopicId);
			if (topic) void revealDialog(topic);
			else isDialogVisible = false;
		});
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

<Section
	id="possibilities"
	variants={['surface']}
	aria-label="Tag and label options"
	data-bento-section
	data-bento-ready={isReady}
>
	<Container variants={['section']}>
		<Div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
			{#each topics as topic (topic.id)}
				<BentoItem
					class={columnClasses[topic.columns]}
					title={topic.title}
					aria-label={`Explore ${topic.title}`}
					aria-haspopup="dialog"
					data-bento-topic={topic.id}
					href={topicHref(topic)}
					onclick={(event) => openDialog(event, topic)}
				>
					<BentoPreview kind={topic.preview} />
				</BentoItem>
			{/each}
		</Div>
	</Container>
</Section>

<Dialog
	{@attach handleDialogCancel}
	{@attach dismissOutside({ contentSelector: '[data-bento-card]', onDismiss: closeDialog })}
	bind:element={dialogElement}
	bind:isVisible={isDialogVisible}
	variants={['bento']}
	inTransition={[fade, { duration: isReducedMotion ? 0 : 200 }]}
	outTransition={[fade, { duration: isReducedMotion ? 0 : 250 }]}
	aria-labelledby="bento-dialog-heading"
	aria-describedby="bento-dialog-description"
	data-bento-dialog
>
	{#if selectedTopic}
		<Container class="py-8 sm:py-16">
			<Card
				isVisible={isCardVisible}
				class="px-6 py-0 sm:px-8 lg:px-16"
				data-bento-card
				inTransition={[
					fly,
					{ y: viewportHeight, duration: isReducedMotion ? 0 : 500, easing: cubicOut }
				]}
				outTransition={[
					fly,
					{ y: viewportHeight, duration: isReducedMotion ? 0 : 250, easing: cubicIn }
				]}
			>
				<Div variants={['bentoDialogHeader']}>
					<Button
						type="button"
						variants={['neutral', 'icon']}
						aria-label="Close topic"
						onclick={closeDialog}
						data-bento-close><X class="size-5" aria-hidden="true" /></Button
					>
				</Div>
				<BentoTopicContent topic={selectedTopic} onClose={closeDialog} />
			</Card>
		</Container>
	{/if}
</Dialog>
