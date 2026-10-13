/** Shared gentle drift; separate this wrapper from artwork rotation and interaction transforms. */
export const floatIllustration = (element: HTMLElement) => {
	const preference = matchMedia('(prefers-reduced-motion: reduce)');
	const animation = element.animate(
		[
			{ transform: 'translateY(0)' },
			{ transform: 'translateY(-12px)' },
			{ transform: 'translateY(0)' }
		],
		{ duration: 6000, iterations: Infinity, easing: 'ease-in-out' }
	);
	animation.id = 'illustration-float';
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
			element.matches(':hover') ||
			(event instanceof FocusEvent && event.relatedTarget instanceof Node
				? element.contains(event.relatedTarget)
				: element.matches(':focus-within') && event.type !== 'focusout');
		updatePlayback();
	};
	element.addEventListener('pointerenter', pauseForInteraction);
	element.addEventListener('pointerleave', resumeAfterInteraction);
	element.addEventListener('focusin', pauseForInteraction);
	element.addEventListener('focusout', resumeAfterInteraction);
	animation.pause();
	const observer = new IntersectionObserver(([entry]) => {
		isInView = entry.isIntersecting;
		updatePlayback();
	});
	observer.observe(element);
	preference.addEventListener('change', updatePlayback);
	document.addEventListener('visibilitychange', updatePlayback);
	return () => {
		element.removeEventListener('pointerenter', pauseForInteraction);
		element.removeEventListener('pointerleave', resumeAfterInteraction);
		element.removeEventListener('focusin', pauseForInteraction);
		element.removeEventListener('focusout', resumeAfterInteraction);
		animation.cancel();
		observer.disconnect();
		preference.removeEventListener('change', updatePlayback);
		document.removeEventListener('visibilitychange', updatePlayback);
	};
};
