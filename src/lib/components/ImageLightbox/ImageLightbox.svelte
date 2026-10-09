<script lang="ts">
	// Imports
	import { Button, Dialog, Div, Img, P } from '#lib/components';
	import { fade } from 'svelte/transition';
	import { X } from '#lib/icons';

	// Types
	type Props = {
		alt: string;
		caption?: string;
		isVisible?: boolean;
		origin?: DOMRect;
		src: string;
	};

	// helpers
	const enterImage = (node: HTMLImageElement) => {
		let animation: Animation | undefined;
		let frame = 0;
		let isDisposed = false;
		const reveal = () => {
			if (isDisposed || !isVisible) return;
			if (!node.naturalWidth) {
				isImageError = true;
				return;
			}
			// Wait for both decoded pixels and the native dialog's layout before measuring.
			frame = requestAnimationFrame(() => {
				if (isDisposed || !isVisible) return;
				animation = node.animate(imageFrames(node), {
					duration: motionDuration(),
					easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
					fill: 'backwards'
				});
				isImageReady = true;
			});
		};
		void node.decode().then(reveal, reveal);
		return () => {
			isDisposed = true;
			cancelAnimationFrame(frame);
			animation?.cancel();
		};
	};
	const exitDialog = (node: Element) => {
		const duration = motionDuration();
		const image = node.querySelector('img');
		if (image && isImageReady) {
			// Preserve the current pose if dismissed before the entry animation finishes.
			const transform = getComputedStyle(image).transform;
			image.getAnimations().forEach((animation) => animation.cancel());
			const frames = imageFrames(image).reverse();
			frames[0] = { transformOrigin: 'top left', transform };
			image.animate(frames, {
				duration,
				easing: 'cubic-bezier(0.64, 0, 0.78, 0)',
				fill: 'forwards'
			});
		}
		node.animate([{ opacity: 1 }, { opacity: 0 }], { duration, fill: 'forwards' });
		return { duration };
	};
	const imageFrames = (node: Element) => {
		const target = node.getBoundingClientRect();
		return [
			{
				transformOrigin: 'top left',
				transform:
					origin && target.width && target.height
						? `translate(${origin.left - target.left}px, ${origin.top - target.top}px) scale(${origin.width / target.width}, ${origin.height / target.height})`
						: 'scale(0.95)'
			},
			{ transformOrigin: 'top left', transform: 'translate(0, 0) scale(1)' }
		];
	};
	const motionDuration = () =>
		typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? 0
			: 350;

	// $props()
	let { alt, caption, isVisible = $bindable(false), origin, src }: Props = $props();

	// $state
	let dialogElement = $state<HTMLDialogElement | null>(null);
	let isImageError = $state(false);
	let isImageReady = $state(false);

	// $effects
	$effect(() => {
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
	bind:element={dialogElement}
	bind:isVisible
	variants={['imageLightbox']}
	aria-label={caption || alt}
	inTransition={[fade, { duration: motionDuration() }]}
	outTransition={[exitDialog, {}]}
>
	<Div class="relative flex min-h-full flex-col items-center justify-center gap-4 p-6 sm:p-16">
		<Button
			variants={['neutral', 'icon']}
			class="fixed top-4 right-4 z-10"
			aria-label="Close image"
			onclick={() => (isVisible = false)}><X class="size-5" aria-hidden="true" /></Button
		>
		<Img
			{src}
			{alt}
			width="960"
			height="720"
			loading="eager"
			fetchpriority="high"
			decoding="async"
			class={`${isImageReady ? 'visible' : 'invisible'} h-auto max-h-[75dvh] w-auto max-w-full rounded-sm object-contain`}
			{@attach enterImage}
		/>
		{#if !isImageReady}
			<P class="absolute inset-x-6 top-1/2 text-center text-white" role="status">
				{isImageError
					? 'This image could not be loaded. Please close it and try again.'
					: 'Loading image...'}
			</P>
		{/if}
		{#if caption}<P class="text-center text-white">{caption}</P>{/if}
	</Div>
</Dialog>
