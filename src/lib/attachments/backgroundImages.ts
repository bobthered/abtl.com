import type { Attachment } from 'svelte/attachments';

type Connection = EventTarget & { effectiveType?: string; saveData?: boolean };
type Promotion = { loading: string | null; priority: string | null; settle: () => void };

let isNavigationPending = false;
const navigationListeners = new Set<() => void>();
export const setBackgroundImagesNavigation = (isPending: boolean) => {
	isNavigationPending = isPending;
	for (const listener of navigationListeners) listener();
};

/** Enhance native lazy images in place; never create competing full-size image requests. */
export const backgroundImages: Attachment<HTMLElement> = (node) => {
	const document = node.ownerDocument;
	const window = document.defaultView!;
	const connection = (window.navigator as Navigator & { connection?: Connection }).connection;
	const candidates = new Set<HTMLImageElement>();
	const active = new Map<HTMLImageElement, Promotion>();
	let idleId: number | undefined;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let isDisposed = false;
	let isLoaded = document.readyState === 'complete';
	const isPaused = () =>
		isDisposed ||
		!isLoaded ||
		isNavigationPending ||
		document.visibilityState === 'hidden' ||
		Boolean(connection?.saveData) ||
		['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '');
	const cancelScheduled = () => {
		if (idleId !== undefined) window.cancelIdleCallback(idleId);
		if (timer !== undefined) clearTimeout(timer);
		idleId = undefined;
		timer = undefined;
	};
	const restoreAttribute = (image: HTMLImageElement, name: string, value: string | null) => {
		if (value === null) image.removeAttribute(name);
		else image.setAttribute(name, value);
	};
	const restorePriority = (image: HTMLImageElement) => {
		const promotion = active.get(image);
		if (promotion && image.getAttribute('fetchpriority') === 'low')
			restoreAttribute(image, 'fetchpriority', promotion.priority);
	};
	const viewport = new IntersectionObserver(
		(entries) => {
			for (const entry of entries)
				if (entry.isIntersecting) restorePriority(entry.target as HTMLImageElement);
		},
		{ rootMargin: '200px' }
	);
	const schedule = () => {
		if (
			isPaused() ||
			active.size >= 2 ||
			!candidates.size ||
			idleId !== undefined ||
			timer !== undefined
		)
			return;
		if (typeof window.requestIdleCallback === 'function')
			idleId = window.requestIdleCallback(pump, { timeout: 2000 });
		else timer = setTimeout(pump, 200);
	};
	const settle = (image: HTMLImageElement) => {
		const promotion = active.get(image);
		if (!promotion) return;
		image.removeEventListener('load', promotion.settle);
		image.removeEventListener('error', promotion.settle);
		viewport.unobserve(image);
		restorePriority(image);
		if (image.getAttribute('loading') === 'eager')
			restoreAttribute(image, 'loading', promotion.loading);
		active.delete(image);
		schedule();
	};
	const collect = (element: Element) => {
		const images =
			element instanceof HTMLImageElement
				? [element]
				: element.querySelectorAll<HTMLImageElement>('img');
		for (const image of images)
			if (image.loading === 'lazy' && !image.complete && !active.has(image)) candidates.add(image);
	};
	const hasSource = (image: HTMLImageElement) =>
		Boolean(
			image.getAttribute('src') ||
			image.getAttribute('srcset') ||
			image.closest('picture')?.querySelector('source[srcset]')
		);
	const hasCriticalImages = () =>
		[...document.images].some(
			(image) =>
				image.isConnected &&
				image.loading !== 'lazy' &&
				!active.has(image) &&
				!image.complete &&
				hasSource(image) &&
				image.getClientRects().length > 0
		);
	const pump = () => {
		idleId = undefined;
		timer = undefined;
		if (isPaused() || hasCriticalImages()) return;
		const ranked: { distance: number; image: HTMLImageElement }[] = [];
		for (const image of candidates) {
			if (!image.isConnected || image.complete || image.loading !== 'lazy') {
				candidates.delete(image);
				continue;
			}
			if (
				image.fetchPriority === 'high' ||
				image.closest('[data-background-images="off"], [hidden], [inert]') ||
				!image.getClientRects().length ||
				!hasSource(image)
			)
				continue;
			const visibility = window.getComputedStyle(image).visibility;
			if (visibility === 'hidden' || visibility === 'collapse') continue;
			const bounds = image.getBoundingClientRect();
			// Let native lazy loading handle visible images at their existing request priority.
			if (
				bounds.bottom > 0 &&
				bounds.top < window.innerHeight &&
				bounds.right > 0 &&
				bounds.left < window.innerWidth
			)
				continue;
			ranked.push({
				distance: Math.max(
					0,
					bounds.top - window.innerHeight,
					-bounds.bottom,
					bounds.left - window.innerWidth,
					-bounds.right
				),
				image
			});
		}
		ranked.sort((first, second) => first.distance - second.distance);
		for (const { image } of ranked.slice(0, Math.max(0, 2 - active.size))) {
			candidates.delete(image);
			const promotion = {
				loading: image.getAttribute('loading'),
				priority: image.getAttribute('fetchpriority'),
				settle: () => settle(image)
			};
			active.set(image, promotion);
			image.addEventListener('load', promotion.settle);
			image.addEventListener('error', promotion.settle);
			viewport.observe(image);
			image.fetchPriority = 'low';
			image.loading = 'eager';
			if (image.complete) settle(image);
		}
	};
	const refresh = () => {
		if (isPaused()) {
			cancelScheduled();
			return;
		}
		for (const image of active.keys()) if (!image.isConnected) settle(image);
		schedule();
	};
	const onLoad = () => {
		isLoaded = true;
		refresh();
	};
	const onNavigation = () => {
		if (isNavigationPending) cancelScheduled();
		else {
			candidates.clear();
			collect(document.body);
			refresh();
		}
	};
	const observer = new MutationObserver((records) => {
		for (const record of records) {
			if (record.type === 'attributes' && record.target instanceof Element)
				collect(
					record.target instanceof HTMLSourceElement && record.target.parentElement
						? record.target.parentElement
						: record.target
				);
			for (const added of record.addedNodes) if (added instanceof Element) collect(added);
		}
		refresh();
	});
	collect(document.body);
	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['src', 'srcset', 'sizes', 'media', 'loading', 'open', 'hidden', 'class']
	});
	document.addEventListener('load', refresh, true);
	document.addEventListener('error', refresh, true);
	document.addEventListener('visibilitychange', refresh);
	document.addEventListener('toggle', refresh, true);
	window.addEventListener('load', onLoad);
	window.addEventListener('scroll', refresh, { passive: true });
	window.addEventListener('resize', refresh, { passive: true });
	connection?.addEventListener('change', refresh);
	navigationListeners.add(onNavigation);
	schedule();
	return () => {
		isDisposed = true;
		cancelScheduled();
		observer.disconnect();
		viewport.disconnect();
		for (const image of active.keys()) settle(image);
		candidates.clear();
		navigationListeners.delete(onNavigation);
		document.removeEventListener('load', refresh, true);
		document.removeEventListener('error', refresh, true);
		document.removeEventListener('visibilitychange', refresh);
		document.removeEventListener('toggle', refresh, true);
		window.removeEventListener('load', onLoad);
		window.removeEventListener('scroll', refresh);
		window.removeEventListener('resize', refresh);
		connection?.removeEventListener('change', refresh);
	};
};
