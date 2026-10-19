<script lang="ts">
	// Imports
	import { A, ActionLabel, Button, Card, Div, H2, Nav, P } from '#lib/components';
	import { afterNavigate } from '$app/navigation';
	import { ChevronDown } from '#lib/icons';
	import { fly } from 'svelte/transition';
	import { mainNavigation as navigation } from '#lib/data/navigation.js';
	import { onMount, tick, untrack } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { subtleReveal } from 'sveltewind/transitions';
	import { twMerge } from 'tailwind-merge';

	// Types
	type SubmenuPanel = {
		id: number;
		index: number;
		isVisible: boolean;
		section: (typeof navigation)[number];
	};

	// consts
	const cleanupTimers = new SvelteSet<ReturnType<typeof setTimeout>>();
	// Nonreactive bridge: hover measures the incoming panel before the browser paints.
	let resizeMenu: ((id?: number) => void) | undefined;

	// helpers
	const animateMenuHeight = (isMotionReduced: boolean) => (node: HTMLElement) => {
		const content = node.firstElementChild as HTMLElement;
		let animation: Animation | undefined;
		let observedPanel: HTMLElement | undefined;
		let targetHeight = 0;
		const resize = (id = panelId) => {
			const panel = content.querySelector<HTMLElement>(`[data-nav-panel-id="${id}"]`);
			if (!panel || activeIndex < 0) return;
			if (observedPanel !== panel) {
				observer.disconnect();
				observer.observe(panel);
				observedPanel = panel;
			}
			const maximum = parseFloat(getComputedStyle(node).maxHeight);
			// Scroll only for actual viewport limits, never the temporary animated height.
			isMenuScrollable = panel.offsetHeight > maximum;
			const height = Math.min(panel.offsetHeight, maximum);
			if (height === targetHeight) return;
			const from = node.getBoundingClientRect().height;
			animation?.cancel();
			targetHeight = height;
			animation = node.animate([{ height: `${from}px` }, { height: `${height}px` }], {
				duration: isMotionReduced || !from ? 0 : 320,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
				fill: 'forwards'
			});
		};
		const observer = new ResizeObserver(() => resize());
		const handleResize = () => resize();
		resizeMenu = resize;
		// Panel changes call the bridge directly; they must not remount this attachment.
		untrack(() => resize());
		window.addEventListener('resize', handleResize);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', handleResize);
			animation?.cancel();
			if (resizeMenu === resize) resizeMenu = undefined;
		};
	};
	const cancelClose = () => {
		clearTimeout(closeTimer);
	};
	const close = () => {
		cancelClose();
		activeIndex = -1;
		for (const panel of panels) panel.isVisible = false;
	};
	const handleFocusOut = () => {
		queueMicrotask(() => {
			if (!root?.contains(document.activeElement)) close();
		});
	};
	const handleKey = async (event: KeyboardEvent, index: number) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			close();
			root?.querySelector<HTMLButtonElement>(`[data-nav-trigger="${index}"]`)?.focus();
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			open(index);
			await tick();
			root?.querySelector<HTMLAnchorElement>('[data-nav-panel] a')?.focus();
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			event.preventDefault();
			const next =
				(index + (event.key === 'ArrowRight' ? 1 : -1) + navigation.length) % navigation.length;
			root?.querySelector<HTMLElement>(`[data-nav-trigger="${next}"]`)?.focus();
			if (navigation[next].children.length) open(next);
			else close();
		}
	};
	const open = async (index: number) => {
		cancelClose();
		if (index === activeIndex) return;
		direction = activeIndex < 0 || index > activeIndex ? 1 : -1;
		activeIndex = index;
		const departingIds = new Set(panels.map((panel) => panel.id));
		for (const panel of panels) panel.isVisible = false;
		const id = ++panelId;
		panels.push({ id, index, isVisible: false, section: navigation[index] });
		// Toggle the primitive's own visibility after mount so its local Svelte transition runs.
		await tick();
		const incoming = panels.find((panel) => panel.id === id);
		if (incoming && activeIndex === index && panelId === id) {
			incoming.isVisible = true;
			await tick();
			// Begin sizing with the incoming slide, without waiting for an observer or outro.
			if (activeIndex === index && panelId === id) resizeMenu?.(id);
		}
		const timer = setTimeout(
			() => {
				panels = panels.filter((panel) => !departingIds.has(panel.id));
				cleanupTimers.delete(timer);
			},
			isReducedMotion ? 0 : 400
		);
		cleanupTimers.add(timer);
	};

	const scheduleClose = () => {
		cancelClose();
		closeTimer = setTimeout(() => {
			if (!root?.contains(document.activeElement)) close();
		}, 160);
	};

	afterNavigate(close);
	onMount(() => {
		const desktop = matchMedia('(min-width: 1280px)');
		const handleBreakpoint = () => {
			if (!desktop.matches) close();
		};
		desktop.addEventListener('change', handleBreakpoint);
		return () => {
			cancelClose();
			for (const timer of cleanupTimers) clearTimeout(timer);
			desktop.removeEventListener('change', handleBreakpoint);
		};
	});

	// $props()
	let { isReducedMotion = false }: { isReducedMotion?: boolean } = $props();

	// $state
	let activeIndex = $state(-1);
	let closeTimer = $state<ReturnType<typeof setTimeout> | undefined>();
	let direction = $state(1);
	let isMenuScrollable = $state(false);
	let panelId = $state(0);
	let panels = $state<SubmenuPanel[]>([]);
	let root = $state<HTMLDivElement | null>(null);

	// $derived
	const isMegaVisible = $derived(activeIndex >= 0 && navigation[activeIndex].children.length > 0);
</script>

<svelte:window
	onpointerdown={(event) => {
		if (!root?.contains(event.target as Node)) close();
	}}
	onkeydown={(event) => {
		if (event.key === 'Escape' && activeIndex >= 0) {
			const previous = activeIndex;
			close();
			root?.querySelector<HTMLButtonElement>(`[data-nav-trigger="${previous}"]`)?.focus();
		}
	}}
/>
<Div
	bind:element={root}
	class="relative hidden xl:block"
	onpointerenter={cancelClose}
	onpointerleave={scheduleClose}
	onfocusout={handleFocusOut}
	data-scroll-reveal="off"
>
	<Nav aria-label="Main navigation" class="flex items-center gap-2">
		{#each navigation as item, index (item.href)}
			{#if item.children.length}
				<Button
					id={`nav-trigger-${index}`}
					data-nav-trigger={index}
					variants={['ghost']}
					class={twMerge(
						'gap-1 px-3 text-sm',
						activeIndex === index ? 'text-primary-600 dark:text-primary-300' : ''
					)}
					aria-expanded={activeIndex === index}
					aria-controls={activeIndex === index ? 'desktop-subnavigation' : undefined}
					onpointerenter={(event) => {
						if (event.pointerType !== 'touch') open(index);
					}}
					onclick={() => (activeIndex === index ? close() : open(index))}
					onkeydown={(event) => handleKey(event, index)}
				>
					{item.label}<ChevronDown
						aria-hidden="true"
						class={twMerge(
							'size-3 transition-transform duration-200 motion-reduce:transition-none',
							activeIndex === index ? 'rotate-180' : ''
						)}
					/>
				</Button>
			{:else}
				<A
					href={item.href}
					data-nav-trigger={index}
					variants={['ghost', 'navigation']}
					class="px-3"
					onpointerenter={close}
					onfocus={close}
					onkeydown={(event) => handleKey(event, index)}
				>
					{item.label}
				</A>
			{/if}
		{/each}
	</Nav>
	<Div
		id="desktop-subnavigation-position"
		class="absolute top-full left-1/2 w-224 -translate-x-1/2 pt-6"
	>
		<Div
			id="desktop-subnavigation"
			isVisible={isMegaVisible}
			transition={[subtleReveal, { duration: isReducedMotion ? 0 : 240 }]}
		>
			<Card
				class="relative overflow-hidden p-0 shadow-xl inset-ring-1 inset-ring-gray-200 dark:inset-ring-gray-800"
			>
				<Div
					class={twMerge(
						'max-h-[calc(100dvh-8rem)] overflow-x-hidden overscroll-contain',
						isMenuScrollable ? '[scrollbar-gutter:stable] overflow-y-auto' : 'overflow-y-hidden'
					)}
					data-nav-viewport
					{@attach animateMenuHeight(isReducedMotion)}
				>
					<Div class="relative grid overflow-x-clip">
						{#each panels as panel (panel.id)}
							<Div
								data-nav-panel
								data-nav-panel-id={panel.id}
								isVisible={panel.isVisible}
								data-direction={direction}
								data-nav-active={panel.index === activeIndex}
								class="absolute top-0 left-0 grid min-h-104 w-full min-w-0 grid-cols-3 gap-4 p-8"
								inTransition={[
									fly,
									{ x: isReducedMotion ? 0 : direction * 96, duration: isReducedMotion ? 0 : 320 }
								]}
								outTransition={[
									fly,
									{ x: isReducedMotion ? 0 : -direction * 96, duration: isReducedMotion ? 0 : 320 }
								]}
							>
								<Div
									class="flex flex-col items-start gap-4 rounded-sm bg-gray-50 p-6 dark:bg-gray-950"
								>
									<P class="text-sm font-semibold text-primary-600 dark:text-primary-300">
										Explore {panel.section.label}
									</P>
									<H2 class="text-2xl">{panel.section.description}</H2>
								</Div>
								<Nav
									aria-label={`${panel.section.label} pages`}
									class="col-span-2 grid grid-cols-2 content-start gap-4"
									aria-labelledby={`nav-trigger-${panel.index}`}
								>
									{#each panel.section.children as child (child.href)}
										<A href={child.href} variants={['ghost', 'navigationItem']} onclick={close}>
											<ActionLabel class="w-full justify-between">
												{child.label}
											</ActionLabel>
										</A>
									{/each}
								</Nav>
							</Div>
						{/each}
					</Div>
				</Div>
			</Card>
		</Div>
	</Div>
</Div>
