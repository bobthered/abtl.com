import type { Attachment } from 'svelte/attachments';

const selector =
	':is(main, dialog) :is(h1, h2, h3, p, article), [data-bento-topic], [data-scroll-reveal], [data-count-up]';
const numberFormat = new Intl.NumberFormat('en-US');
const excluded = 'header, nav, [data-scroll-reveal="off"], [data-marquee], [data-stock-columns]';

/** One observer for page content, routed content, and portalled dialogs. Content stays visible without JS. */
export const scrollReveal: Attachment<HTMLElement> = () => {
	const preference = matchMedia('(prefers-reduced-motion: reduce)');
	const observed = new Set<HTMLElement>();
	const completed = new WeakSet<HTMLElement>();
	const pending = new Set<HTMLElement>();
	const animations = new Map<HTMLElement, Animation>();
	const counters = new Map<HTMLElement, { start: number; target: number; text: string }>();
	let batchFrame = 0;
	let countFrame = 0;

	const finishCounter = (element: HTMLElement) => {
		const counter = counters.get(element);
		if (counter) element.textContent = counter.text;
		counters.delete(element);
	};
	const advanceCounts = (time: number) => {
		for (const [element, counter] of counters) {
			if (!element.isConnected) {
				counters.delete(element);
				continue;
			}
			if (time < counter.start) continue;
			const progress = Math.min((time - counter.start) / 1200, 1);
			element.textContent = numberFormat.format(
				Math.round(counter.target * (1 - (1 - progress) ** 3))
			);
			if (progress === 1) finishCounter(element);
		}
		countFrame = counters.size ? requestAnimationFrame(advanceCounts) : 0;
	};
	const flush = () => {
		batchFrame = 0;
		const targets = [...pending]
			.filter((element) => element.isConnected)
			.map((element) => ({ element, top: element.getBoundingClientRect().top }))
			.sort(
				(a, b) =>
					a.top - b.top ||
					a.element.getBoundingClientRect().left - b.element.getBoundingClientRect().left
			);
		pending.clear();
		let rowTop = -Infinity;
		let rowIndex = 0;
		for (const { element, top } of targets) {
			if (top - rowTop > 16) {
				rowTop = top;
				rowIndex = 0;
			}
			const delay = Math.min(rowIndex++ * 70, 210);
			element.dataset.scrollRevealState = 'complete';
			completed.add(element);
			if (preference.matches || document.hidden || element.matches(':focus-within')) continue;
			element.dataset.scrollRevealDelay = String(delay);
			// Animate individual translate so existing hover rotations/scales remain intact.
			const animation = element.animate(
				[
					{ opacity: 0.65, translate: '0 0.5rem' },
					{ opacity: 1, translate: '0 0' }
				],
				{ duration: 460, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }
			);
			animations.set(element, animation);
			animation.onfinish = () => {
				animation.cancel();
				animations.delete(element);
			};
			const target = Number(element.dataset.countUp);
			if (
				element.hasAttribute('data-count-up') &&
				Number.isFinite(target) &&
				target >= 0 &&
				!element.children.length
			) {
				counters.set(element, {
					start: performance.now() + delay,
					target,
					text: element.textContent ?? ''
				});
				if (!countFrame) countFrame = requestAnimationFrame(advanceCounts);
			}
		}
	};
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const element = entry.target as HTMLElement;
				observer.unobserve(element);
				observed.delete(element);
				pending.add(element);
			}
			if (pending.size && !batchFrame) batchFrame = requestAnimationFrame(flush);
		},
		{ threshold: 0.12 }
	);
	const register = (root: Element) => {
		const targets = [...(root.matches(selector) ? [root] : []), ...root.querySelectorAll(selector)];
		for (const target of targets) {
			if (!(target instanceof HTMLElement) || observed.has(target) || completed.has(target))
				continue;
			if (target.closest(excluded) || target.parentElement?.closest('[aria-hidden="true"]'))
				continue;
			// Reveal a card as a unit; avoid stacking entrance transforms on its descendants.
			if (
				!target.hasAttribute('data-count-up') &&
				target.parentElement?.closest(
					'article, [data-bento-topic], [data-scroll-reveal]:not([data-scroll-reveal="off"])'
				)
			)
				continue;
			observed.add(target);
			observer.observe(target);
		}
	};
	const finishMotion = () => {
		if (!preference.matches && !document.hidden) return;
		animations.forEach((animation) => animation.cancel());
		animations.clear();
		counters.forEach((_, element) => finishCounter(element));
		cancelAnimationFrame(countFrame);
		countFrame = 0;
	};
	const focus = (event: FocusEvent) => {
		if (!(event.target instanceof Element)) return;
		for (const [element, animation] of animations) {
			if (!element.contains(event.target)) continue;
			animation.cancel();
			animations.delete(element);
			finishCounter(element);
		}
	};
	const mutations = new MutationObserver((records) => {
		for (const record of records)
			for (const node of record.addedNodes) if (node instanceof Element) register(node);
		if (!records.some((record) => [...record.removedNodes].some((node) => node instanceof Element)))
			return;
		for (const element of observed)
			if (!element.isConnected) {
				observer.unobserve(element);
				observed.delete(element);
			}
		for (const [element, animation] of animations)
			if (!element.isConnected) {
				animation.cancel();
				animations.delete(element);
			}
		for (const element of counters.keys()) if (!element.isConnected) counters.delete(element);
	});
	register(document.body);
	mutations.observe(document.body, { childList: true, subtree: true });
	preference.addEventListener('change', finishMotion);
	document.addEventListener('visibilitychange', finishMotion);
	document.addEventListener('focusin', focus);
	return () => {
		observer.disconnect();
		mutations.disconnect();
		cancelAnimationFrame(batchFrame);
		cancelAnimationFrame(countFrame);
		animations.forEach((animation) => animation.cancel());
		counters.forEach((_, element) => finishCounter(element));
		preference.removeEventListener('change', finishMotion);
		document.removeEventListener('visibilitychange', finishMotion);
		document.removeEventListener('focusin', focus);
	};
};
