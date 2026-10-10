<script lang="ts">
	// Imports
	import { ArrowRight, RotateCw } from '#lib/icons';
	import {
		Br,
		Button,
		Container,
		Div,
		Figcaption,
		Figure,
		H3,
		Img,
		P,
		Section,
		Span,
		StockTag
	} from '#lib/components';
	import inspectionBack from '#lib/assets/tags/backs/inspection-record-01.svg';
	import inspectionFront from '#lib/assets/tags/fronts/inspection-record-01.svg';
	import { onMount } from 'svelte';
	import serviceFront from '#lib/assets/tags/fronts/service-tag-01.svg';
	import serviceSecondFront from '#lib/assets/tags/fronts/service-tag-02.svg';
	import { stockColors } from './stockColors';

	// $props()
	let {
		isStandalone = false,
		onRequestSamples
	}: { isStandalone?: boolean; onRequestSamples: () => void } = $props();

	// $state
	let illustrationElement = $state<HTMLDivElement | null>(null);
	let isBackVisible = $state(false);
	let selectedColorId = $state('manila');

	// $derived
	const selectedColor = $derived(stockColors.find((color) => color.id === selectedColorId)!);

	// $effects
	onMount(() => {
		if (!illustrationElement) return;
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		const animation = illustrationElement.animate(
			[
				{ transform: 'translateY(0)' },
				{ transform: 'translateY(-12px)' },
				{ transform: 'translateY(0)' }
			],
			{ duration: 6000, iterations: Infinity, easing: 'ease-in-out' }
		);
		let isInView = false;
		let isInteracting = false;
		const updatePlayback = () => {
			if (preference.matches || document.hidden || !isInView || isInteracting) animation.pause();
			else animation.play();
		};
		const pauseForInteraction = () => {
			isInteracting = true;
			updatePlayback();
		};
		const resumeAfterInteraction = (event: Event) => {
			isInteracting =
				illustrationElement!.matches(':hover') ||
				(event instanceof FocusEvent && event.relatedTarget instanceof Node
					? illustrationElement!.contains(event.relatedTarget)
					: illustrationElement!.matches(':focus-within') && event.type !== 'focusout');
			updatePlayback();
		};
		illustrationElement.addEventListener('pointerenter', pauseForInteraction);
		illustrationElement.addEventListener('pointerleave', resumeAfterInteraction);
		illustrationElement.addEventListener('focusin', pauseForInteraction);
		illustrationElement.addEventListener('focusout', resumeAfterInteraction);
		animation.pause();
		const observer = new IntersectionObserver(([entry]) => {
			isInView = entry.isIntersecting;
			updatePlayback();
		});
		observer.observe(illustrationElement);
		preference.addEventListener('change', updatePlayback);
		document.addEventListener('visibilitychange', updatePlayback);
		return () => {
			illustrationElement?.removeEventListener('pointerenter', pauseForInteraction);
			illustrationElement?.removeEventListener('pointerleave', resumeAfterInteraction);
			illustrationElement?.removeEventListener('focusin', pauseForInteraction);
			illustrationElement?.removeEventListener('focusout', resumeAfterInteraction);
			animation.cancel();
			observer.disconnect();
			preference.removeEventListener('change', updatePlayback);
			document.removeEventListener('visibilitychange', updatePlayback);
		};
	});
</script>

{#snippet tagImage(id: string, artwork?: string)}
	<Div class="relative w-full">
		<StockTag class={stockColors.find((color) => color.id === id)?.className} />
		{#if artwork}
			<Img
				src={artwork}
				alt=""
				aria-hidden="true"
				width="237"
				height="474"
				class="absolute inset-0 h-full w-full mix-blend-multiply"
			/>
		{/if}
	</Div>
{/snippet}

{#snippet studio()}
	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-count-heading"
		data-color-section="color-studio"
	>
		<Div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<Div>
				<P variants={['eyebrow']}>Your color. Your message.</P>
				<H3 id="stock-count-heading" class="text-4xl font-light tracking-tight sm:text-5xl"
					>Make your message unmistakable.</H3
				>
				<P variants={['dialogBody']} class="mt-6"
					>A color can say &ldquo;check this,&rdquo; &ldquo;keep this,&rdquo; or &ldquo;start
					here&rdquo; before anyone reads a word. Give every step in your workflow a color of its
					own.</P
				>
				<Div data-stock-color-counter class="mt-8 flex items-center gap-4">
					<Span
						class="text-6xl font-semibold tracking-tight text-primary-500 tabular-nums dark:text-primary-400"
						aria-hidden="true"
						data-count-up={stockColors.length}
						data-stock-color-total>{stockColors.length}</Span
					>
					<Span class="sr-only">{stockColors.length}</Span>
					<P class="max-w-40 text-base">stock colors.<Br />One unmistakable impression.</P>
				</Div>
				<P class="mt-8 mb-3 text-sm font-medium">Try a stock color</P>
				<Div class="flex max-w-sm flex-wrap gap-2" role="group" aria-label="Preview stock colors">
					{#each stockColors as color (color.id)}
						<Button
							variants={['ghost']}
							class="size-10 min-h-0 p-2"
							aria-label={`Preview ${color.name}`}
							aria-pressed={selectedColorId === color.id}
							onclick={() => (selectedColorId = color.id)}
						>
							<Span
								class={`${color.className} block size-6 rounded-full bg-current inset-ring-1 inset-ring-gray-950/20 ${selectedColorId === color.id ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950' : ''}`}
							/>
						</Button>
					{/each}
				</Div>
			</Div>
			<Figure>
				<Div variants={['colorStudio']}>
					<Div bind:element={illustrationElement} class="relative h-96 w-full sm:h-112">
						<Div
							variants={['colorStudioSide']}
							class="left-1/2 -translate-x-full -rotate-12 group-focus-within:-rotate-18 group-hover:-translate-x-5/4 group-hover:-rotate-18"
						>
							{@render tagImage('white', serviceFront)}
						</Div>
						<Div
							variants={['colorStudioSide']}
							class="right-1/2 translate-x-full rotate-12 group-focus-within:rotate-18 group-hover:translate-x-5/4 group-hover:rotate-18"
						>
							{@render tagImage('fluorescent-orange', serviceSecondFront)}
						</Div>
						<Button
							variants={['ghost']}
							class="absolute top-1/2 left-1/2 z-10 w-36 -translate-1/2 bg-transparent! p-0 hover:bg-transparent! sm:w-44"
							aria-label={isBackVisible ? 'Show tag front' : 'Show tag back'}
							onclick={() => (isBackVisible = !isBackVisible)}
						>
							<Div
								class={`w-full transition-transform duration-700 transform-3d motion-reduce:transition-none ${isBackVisible ? 'rotate-y-180' : ''}`}
								data-stock-preview-color={selectedColorId}
								data-stock-preview-side={isBackVisible ? 'back' : 'front'}
							>
								<Div class="w-full backface-hidden"
									>{@render tagImage(selectedColorId, inspectionFront)}</Div
								>
								<Div class="absolute inset-0 rotate-y-180 backface-hidden"
									>{@render tagImage(selectedColorId, inspectionBack)}</Div
								>
							</Div>
						</Button>
					</Div>
					<Div class="relative flex w-full items-center justify-between gap-4">
						<P class="text-sm font-medium" aria-live="polite"
							>{selectedColor.name} &middot; {isBackVisible ? 'Back' : 'Front'}</P
						>
						<Button variants={['neutral']} onclick={() => (isBackVisible = !isBackVisible)}
							><RotateCw class="size-4" aria-hidden="true" />Flip tag</Button
						>
					</Div>
				</Div>
				<Figcaption variants={['dialogCaption']}
					>Your stock is part of the design. Explore our supplied tag artwork on each color;
					physical samples are the best way to choose.</Figcaption
				>
			</Figure>
		</Div>
	</Section>
{/snippet}

<Div data-stock-color-content>
	{#if isStandalone}<Container>{@render studio()}</Container>{:else}{@render studio()}{/if}

	<Section
		variants={['dialogSection', 'sampleInvitation']}
		class={isStandalone ? '' : '-mx-6 sm:-mx-8 lg:-mx-16'}
		aria-labelledby="stock-samples-heading"
		data-color-section="samples"
	>
		<Container class="flex flex-col items-center gap-6">
			<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600"
				>From your screen to your hands</P
			>
			<H3 id="stock-samples-heading" class="max-w-xl text-4xl font-light tracking-tight sm:text-5xl"
				>Meet your next tag color.</H3
			>
			<P class="max-w-lg text-lg text-gray-300 dark:text-gray-600"
				>One favorite or a handful of possibilities. We'll send the stock colors you want to
				compare.</P
			>
			<Button variants={['large', 'neutral']} onclick={onRequestSamples} aria-haspopup="dialog"
				>Request Samples <ArrowRight class="size-5" aria-hidden="true" /></Button
			>
			<P class="text-sm text-gray-300 dark:text-gray-600">Choose your colors in one quick list.</P>
		</Container>
	</Section>
</Div>
