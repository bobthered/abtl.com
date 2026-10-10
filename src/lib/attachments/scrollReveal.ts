import type { Attachment } from 'svelte/attachments';

type RevealElement = HTMLElement | SVGSVGElement;

// Reveal when the top reaches 80% of viewport height (20% above the bottom).
const revealDuration = 700;
const revealViewportOffset = 0.2;
const pendingClass = 'motion-safe:opacity-0';

const contentSelector =
	'h1, h2, h3, h4, h5, h6, p, article, figure, figcaption, img, a, button, ul, ol, dl, blockquote, pre, table, form, label, input, select, textarea, details, summary, [role="group"]';
const selector = `:is(main, dialog, footer) :is(${contentSelector}, div, span, svg, canvas), footer nav, [data-marquee], [data-bento-topic], [data-scroll-reveal], [data-count-up]`;
const numberFormat = new Intl.NumberFormat('en-US');
const excluded =
	'header, main nav, dialog nav, .sr-only, [data-scroll-reveal="off"], [data-stock-columns]';

/** Discover content and visual surfaces from rendered DOM, without page-specific opt-ins. */
const revealTarget = (element: Element): RevealElement | null => {
	if (element.closest(excluded)) return null;
	const marquee = element.closest('[data-marquee]');
	// Move a stationary wrapper, never the scrolling track or repeated copies.
	if (marquee)
		return element === marquee && marquee.parentElement instanceof HTMLElement
			? marquee.parentElement
			: null;
	const decorativeGroup = element.closest('[aria-hidden="true"]');
	if (decorativeGroup instanceof HTMLElement) return decorativeGroup;
	if (element instanceof SVGSVGElement) {
		const parent = element.parentElement;
		return parent instanceof HTMLElement && parent.matches('div, span, figure, a, button')
			? parent
			: element;
	}
	if (!(element instanceof HTMLElement)) return null;
	if (
		element.matches(
			`${contentSelector}, canvas, footer nav, [data-bento-topic], [data-scroll-reveal], [data-count-up]`
		)
	)
		return element;
	if (
		[...element.childNodes].some(
			(node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
		)
	)
		return element;
	// CSS-only illustrations and card surfaces are content too. Leave large structural shells alone.
	const style = getComputedStyle(element);
	const isSurface =
		style.backgroundImage !== 'none' ||
		!['transparent', 'rgba(0, 0, 0, 0)'].includes(style.backgroundColor) ||
		style.boxShadow !== 'none' ||
		style.clipPath !== 'none';
	return isSurface && element.getBoundingClientRect().height <= innerHeight * 1.5 ? element : null;
};

/** One observer for page content, routed content, and portalled dialogs. Content stays visible without JS. */
export const scrollReveal: Attachment<HTMLElement> = () => {
	const preference = matchMedia('(prefers-reduced-motion: reduce)');
	const observed = new Set<RevealElement>();
	const completed = new WeakSet<RevealElement>();
	const groups = new WeakSet<RevealElement>();
	const pending = new Set<RevealElement>();
	const prepared = new Set<RevealElement>();
	const animations = new Map<RevealElement, Animation>();
	const counters = new Map<RevealElement, { start: number; target: number; text: string }>();
	let batchFrame = 0;
	let countFrame = 0;
	let observer: IntersectionObserver;

	const show = (element: RevealElement) => {
		element.classList.remove(pendingClass);
		prepared.delete(element);
	};
	const finishCounter = (element: RevealElement) => {
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
			.filter((element) => element.isConnected && !completed.has(element))
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
			show(element);
			element.dataset.scrollRevealState = 'complete';
			completed.add(element);
			if (preference.matches || document.hidden || element.matches(':focus-within')) continue;
			element.dataset.scrollRevealDelay = String(delay);
			// Animate individual translate so existing hover rotations/scales remain intact.
			const animation = element.animate(
				[
					{ opacity: 0, translate: '0 0.75rem' },
					{ opacity: 1, translate: '0 0' }
				],
				{
					duration: revealDuration,
					delay,
					easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
					fill: 'backwards'
				}
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
	const queueReveal = (element: RevealElement) => {
		observer.unobserve(element);
		observed.delete(element);
		pending.add(element);
		if (!batchFrame) batchFrame = requestAnimationFrame(flush);
	};
	const observeViewport = () => {
		observer?.disconnect();
		// IntersectionObserver percentage margins use width, so compute pixels from height.
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries)
					if (entry.isIntersecting) queueReveal(entry.target as RevealElement);
			},
			{
				rootMargin: `0px 0px -${Math.round(innerHeight * revealViewportOffset)}px 0px`,
				threshold: 0
			}
		);
		observed.forEach((element) => observer.observe(element));
	};
	// At the scroll limit, reveal reachable content that cannot rise to the trigger line.
	const revealAtEnd = (event: Event) => {
		const scroller = event.target === document ? document.scrollingElement : event.target;
		if (
			!(scroller instanceof HTMLElement) ||
			(scroller !== document.scrollingElement && !(scroller instanceof HTMLDialogElement))
		)
			return;
		if (scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop > 2) return;
		for (const element of observed) {
			const dialog = element.closest('dialog');
			if (dialog ? dialog !== scroller : scroller !== document.scrollingElement) continue;
			const bounds = element.getBoundingClientRect();
			if (bounds.top < innerHeight && bounds.bottom > 0) queueReveal(element);
		}
	};
	const register = (root: Element) => {
		const candidates = [
			...(root.matches(selector) ? [root] : []),
			...root.querySelectorAll(selector)
		];
		const targets = new Set(
			candidates.map(revealTarget).filter((target): target is RevealElement => target !== null)
		);
		for (const target of targets) {
			if (observed.has(target) || completed.has(target) || target.closest(excluded)) continue;
			if (target.parentElement?.closest('[aria-hidden="true"]')) continue;
			// Select outer content units first, regardless of discovery order; new descendants inherit them.
			let ancestor = target.parentElement;
			let isGrouped = false;
			while (ancestor) {
				if (targets.has(ancestor) || groups.has(ancestor)) {
					isGrouped = true;
					break;
				}
				ancestor = ancestor.parentElement;
			}
			if (isGrouped && !target.hasAttribute('data-count-up')) continue;
			groups.add(target);
			if (preference.matches) {
				completed.add(target);
				target.dataset.scrollRevealState = 'complete';
				continue;
			}
			target.dataset.scrollRevealState = 'pending';
			target.classList.add(pendingClass);
			prepared.add(target);
			observed.add(target);
			observer.observe(target);
		}
	};
	const finishMotion = () => {
		if (!preference.matches && !document.hidden) return;
		if (preference.matches) {
			for (const element of prepared) {
				show(element);
				observer.unobserve(element);
				observed.delete(element);
				pending.delete(element);
				completed.add(element);
				element.dataset.scrollRevealState = 'complete';
			}
		}
		animations.forEach((animation) => animation.cancel());
		animations.clear();
		counters.forEach((_, element) => finishCounter(element));
		cancelAnimationFrame(countFrame);
		countFrame = 0;
	};
	const focus = (event: FocusEvent) => {
		if (!(event.target instanceof Element)) return;
		for (const element of prepared) {
			if (!element.contains(event.target)) continue;
			show(element);
			observer.unobserve(element);
			observed.delete(element);
			pending.delete(element);
			completed.add(element);
			element.dataset.scrollRevealState = 'complete';
		}
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
				show(element);
				observer.unobserve(element);
				observed.delete(element);
			}
		for (const [element, animation] of animations)
			if (!element.isConnected) {
				animation.cancel();
				animations.delete(element);
			}
		for (const element of prepared)
			if (!element.isConnected) {
				show(element);
				pending.delete(element);
			}
		for (const element of counters.keys()) if (!element.isConnected) counters.delete(element);
	});
	observeViewport();
	register(document.body);
	window.addEventListener('resize', observeViewport);
	document.addEventListener('scroll', revealAtEnd, { capture: true, passive: true });
	mutations.observe(document.body, { childList: true, subtree: true });
	preference.addEventListener('change', finishMotion);
	document.addEventListener('visibilitychange', finishMotion);
	document.addEventListener('focusin', focus);
	return () => {
		observer.disconnect();
		prepared.forEach(show);
		window.removeEventListener('resize', observeViewport);
		document.removeEventListener('scroll', revealAtEnd, true);
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
