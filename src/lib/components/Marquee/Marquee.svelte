<script lang="ts" generics="T">
	// Imports
	import { Div, Span } from '#lib/components';
	import { dragScroll } from '#lib/attachments';
	import { onMount, type Snippet } from 'svelte';

	// Types
	type Props = {
		ariaLabel: string;
		class?: string;
		gapClass?: string;
		isCopiesInteractive?: boolean;
		isPaused?: boolean;
		isRandomStart?: boolean;
		items: readonly T[];
		pixelsPerSecond?: number;
		renderItem: Snippet<[T, boolean]>;
	};

	// consts
	const helpId = $props.id();

	// helpers
	const browseItems = (event: KeyboardEvent) => {
		if (!element || !track || !items.length || !['ArrowLeft', 'ArrowRight'].includes(event.key))
			return;
		event.preventDefault();
		isFocused = true;
		const copy = track.firstElementChild as HTMLElement;
		const stride =
			(copy.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0)) / items.length;
		const direction = event.key === 'ArrowRight' ? 1 : -1;
		if (animation) {
			const duration = Number(animation.effect?.getTiming().duration);
			const nextTime =
				Number(animation.currentTime ?? 0) + ((direction * stride) / pixelsPerSecond) * 1000;
			animation.currentTime = ((nextTime % duration) + duration) % duration;
		}
	};
	const dragMarquee = dragScroll({
		getPosition: () => (Number(animation?.currentTime ?? 0) * pixelsPerSecond) / 1000,
		isEnabled: () => isReady && isDocumentVisible && isInView,
		onDragChange: (isActive) => {
			isDragging = isActive;
		},
		onInteractionChange: (isActive) => {
			isInteracting = isActive;
			if (!isActive && isMotionActive) animation?.play();
		},
		onStart: () => {
			isFocused = false;
			animation?.pause();
		},
		setPosition: (position) => {
			if (!animation) return;
			const duration = Number(animation.effect?.getTiming().duration);
			const time = (position / pixelsPerSecond) * 1000;
			animation.currentTime = ((time % duration) + duration) % duration;
		}
	});
	const initializeMotion = () => {
		if (!element || !track) return;
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const startIndex = isRandomStart ? Math.floor(Math.random() * items.length) : 0;
		let previousDistance = 0;
		const updateAnimation = () => {
			if (!track) return;
			const copy = track.firstElementChild as HTMLElement | null;
			if (!copy?.offsetWidth || !items.length) return;
			const distance = copy.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
			copyCount = Math.max(2, Math.ceil(element!.clientWidth / distance) + 1);
			// ResizeObserver can fire without a change to the loop length. Keep its animation running.
			if (distance === previousDistance) return;
			previousDistance = distance;
			// Keep the same position when responsive sizing changes the loop's length.
			const previousDuration = Number(animation?.effect?.getTiming().duration) || 1;
			const phase = animation
				? Number(animation.currentTime ?? 0) / previousDuration
				: ((copy.children[startIndex] as HTMLElement).offsetLeft - copy.offsetLeft) / distance;
			animation?.cancel();
			animation = track.animate(
				[{ transform: 'translateX(0)' }, { transform: `translateX(-${distance}px)` }],
				{ duration: (distance / pixelsPerSecond) * 1000, iterations: Infinity, easing: 'linear' }
			);
			animation.pause();
			animation.currentTime = (((phase % 1) * distance) / pixelsPerSecond) * 1000;
			isReady = true;
		};
		const updatePreference = () => {
			isReducedMotion = preference.matches;
		};
		const updateVisibility = () => {
			isDocumentVisible = !document.hidden;
		};
		const observer = new IntersectionObserver((entries) => {
			isInView = entries.some((entry) => entry.isIntersecting);
		});
		const resizeObserver = new ResizeObserver(updateAnimation);
		observer.observe(element);
		resizeObserver.observe(track.firstElementChild!);
		resizeObserver.observe(element);
		updatePreference();
		updateVisibility();
		updateAnimation();
		preference.addEventListener('change', updatePreference);
		document.addEventListener('visibilitychange', updateVisibility);
		return () => {
			observer.disconnect();
			resizeObserver.disconnect();
			preference.removeEventListener('change', updatePreference);
			document.removeEventListener('visibilitychange', updateVisibility);
			animation?.cancel();
		};
	};
	onMount(initializeMotion);

	// $props()
	let {
		ariaLabel,
		class: className = '',
		gapClass = 'gap-8',
		isCopiesInteractive = false,
		isPaused = false,
		isRandomStart = true,
		items,
		pixelsPerSecond = 32,
		renderItem
	}: Props = $props();

	// $state
	let animation = $state.raw<Animation | null>(null);
	let copyCount = $state(2);
	let element = $state<HTMLDivElement | null>(null);
	let isDocumentVisible = $state(true);
	let isDragging = $state(false);
	let isFocused = $state(false);
	let isHovered = $state(false);
	let isInteracting = $state(false);
	let isInView = $state(true);
	let isReady = $state(false);
	let isReducedMotion = $state(true);
	let track = $state<HTMLDivElement | null>(null);

	// $derived
	const isMotionActive = $derived(
		isReady &&
			!isInteracting &&
			!isPaused &&
			!isHovered &&
			!isFocused &&
			!isReducedMotion &&
			isDocumentVisible &&
			isInView
	);

	// $effects
	$effect(() => {
		if (!animation) return;
		if (isMotionActive) animation.play();
		else animation.pause();
	});
</script>

<Div
	{@attach dragMarquee}
	bind:element
	variants={['marquee']}
	class={`${className} ${isReady ? '' : 'opacity-0'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
	role="region"
	tabindex={0}
	aria-label={ariaLabel}
	aria-describedby={helpId}
	onpointerenter={(event) => {
		if (event.pointerType !== 'touch') isHovered = true;
	}}
	onpointerleave={(event) => {
		if (event.pointerType !== 'touch') isHovered = false;
	}}
	onfocusin={(event) => (isFocused = (event.target as HTMLElement).matches(':focus-visible'))}
	onfocusout={() => (isFocused = false)}
	onkeydown={browseItems}
	data-marquee
>
	<Span id={helpId} class="sr-only"
		>Hover or focus to pause. Drag horizontally or use the left and right arrow keys to browse
		items.</Span
	>
	<Div bind:element={track} variants={['marqueeTrack']} class={gapClass} data-marquee-track>
		{#each Array.from({ length: copyCount }, (_, index) => index) as copy (copy)}
			<Div
				variants={['marqueeCopy']}
				class={gapClass}
				aria-hidden={copy > 0 && !isCopiesInteractive ? 'true' : undefined}
				inert={copy > 0 && !isCopiesInteractive}
				data-marquee-copy
			>
				{#each items as item, index (index)}
					<Div class="flex shrink-0" data-marquee-item>
						{@render renderItem(item, copy > 0)}
					</Div>
				{/each}
			</Div>
		{/each}
	</Div>
</Div>
