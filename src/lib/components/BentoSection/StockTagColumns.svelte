<script lang="ts">
	// Imports
	import { Div, StockTag } from '#lib/components';
	import { onMount, tick } from 'svelte';
	import { stockColors } from './stockColors';

	// consts
	const columnCount = 6;
	const hoverPlaybackRate = 2.5;
	const pixelsPerSecond = 24;
	const speedTransitionDuration = 400;

	// helpers
	const shuffleColors = () => {
		const colors = [...stockColors];
		for (let index = colors.length - 1; index > 0; index -= 1) {
			const other = Math.floor(Math.random() * (index + 1));
			[colors[index], colors[other]] = [colors[other], colors[index]];
		}
		return colors;
	};

	// $state
	let columns = $state(Array.from({ length: columnCount }, () => stockColors));
	let element = $state<HTMLDivElement | null>(null);
	let isReady = $state(false);

	// $effects
	onMount(() => {
		const animations: Animation[] = [];
		const distances: number[] = [];
		const interactionController = new AbortController();
		let interactionFrame = 0;
		let isFocused = false;
		let isHovered = false;
		let isDisposed = false;
		let isInView = false;
		const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
		const transitionSpeed = () => {
			cancelAnimationFrame(interactionFrame);
			const targetRate =
				!motionPreference.matches && (isHovered || isFocused) ? hoverPlaybackRate : 1;
			const startRate = animations.find((animation) => animation)?.playbackRate ?? 1;
			const startTime = performance.now();
			const applyRate = (rate: number) =>
				animations.forEach((animation) => animation.updatePlaybackRate(rate));
			if (!isInView || document.hidden || motionPreference.matches) {
				applyRate(targetRate);
				return;
			}
			if (Math.abs(targetRate - startRate) < 0.001) {
				applyRate(targetRate);
				return;
			}
			// Only run JS during this short speed ramp; the loops stay compositor-driven.
			const advance = (time: number) => {
				const progress = Math.min((time - startTime) / speedTransitionDuration, 1);
				const eased = progress * progress * (3 - 2 * progress);
				applyRate(startRate + (targetRate - startRate) * eased);
				if (progress < 1) interactionFrame = requestAnimationFrame(advance);
			};
			interactionFrame = requestAnimationFrame(advance);
		};
		const updatePlayback = () => {
			for (const animation of animations) {
				if (isInView && !document.hidden && !motionPreference.matches) animation.play();
				else animation.pause();
			}
			transitionSpeed();
		};
		const resizeObserver = new ResizeObserver(() => {
			const tracks = element?.querySelectorAll<HTMLElement>('[data-stock-column-track]');
			tracks?.forEach((track, index) => {
				const copy = track.firstElementChild as HTMLElement;
				const distance = copy.offsetHeight;
				if (!track.offsetWidth || !distance || distances[index] === distance) return;
				const previous = animations[index];
				const previousDuration = Number(previous?.effect?.getTiming().duration);
				const phase =
					previous && previousDuration
						? (Number(previous.currentTime) / previousDuration) % 1
						: Math.random();
				previous?.cancel();
				// One complete copy includes its trailing gap, so the loop never jumps.
				const keyframes = [
					{ transform: 'translateY(0)' },
					{ transform: `translateY(-${distance}px)` }
				];
				const animation = track.animate(index % 2 === 0 ? [...keyframes].reverse() : keyframes, {
					duration: (distance / pixelsPerSecond) * 1000,
					easing: 'linear',
					iterations: Infinity
				});
				animation.pause();
				animation.currentTime = ((phase * distance) / pixelsPerSecond) * 1000;
				animations[index] = animation;
				distances[index] = distance;
			});
			isReady = true;
			updatePlayback();
		});
		const intersectionObserver = new IntersectionObserver(([entry]) => {
			isInView = entry.isIntersecting;
			updatePlayback();
		});
		columns = Array.from({ length: columnCount }, shuffleColors);
		void tick().then(() => {
			if (isDisposed || !element) return;
			const tile = element.closest<HTMLElement>('a, button');
			if (tile) {
				const options = { signal: interactionController.signal };
				isHovered = matchMedia('(hover: hover)').matches && tile.matches(':hover');
				isFocused = tile.matches(':focus-visible');
				tile.addEventListener(
					'pointerenter',
					(event) => {
						isHovered = event.pointerType !== 'touch';
						updatePlayback();
					},
					options
				);
				tile.addEventListener(
					'pointerleave',
					() => {
						isHovered = false;
						updatePlayback();
					},
					options
				);
				tile.addEventListener(
					'focusin',
					() => {
						isFocused = true;
						updatePlayback();
					},
					options
				);
				tile.addEventListener(
					'focusout',
					() => {
						isFocused = false;
						updatePlayback();
					},
					options
				);
			}
			resizeObserver.observe(element);
			intersectionObserver.observe(element);
		});
		motionPreference.addEventListener('change', updatePlayback);
		document.addEventListener('visibilitychange', updatePlayback);
		return () => {
			isDisposed = true;
			cancelAnimationFrame(interactionFrame);
			interactionController.abort();
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			motionPreference.removeEventListener('change', updatePlayback);
			document.removeEventListener('visibilitychange', updatePlayback);
			animations.forEach((animation) => animation.cancel());
		};
	});
</script>

<Div
	bind:element
	variants={['stockColumns']}
	class={isReady ? 'opacity-100' : 'opacity-0'}
	aria-hidden="true"
	data-stock-columns
>
	<Div variants={['stockColumnGrid']} data-stock-column-grid>
		{#each columns as colors, index (index)}
			<Div class={index > 3 ? 'hidden min-w-0 sm:block' : 'min-w-0'} data-stock-column={index + 1}>
				<Div variants={['stockColumnTrack']} data-stock-column-track>
					{#each [0, 1] as copy (copy)}
						<Div variants={['stockColumnCopy']} data-stock-column-copy={copy}>
							{#each colors as color (color.id)}
								<StockTag class={color.className} />
							{/each}
						</Div>
					{/each}
				</Div>
			</Div>
		{/each}
	</Div>
</Div>
