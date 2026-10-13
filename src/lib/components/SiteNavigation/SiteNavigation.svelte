<script lang="ts">
	// Imports
	import { A, Button, Card, Div, H2, Nav, P, Span } from '#lib/components';
	import { afterNavigate } from '$app/navigation';
	import { ArrowUpRight, ChevronDown } from '#lib/icons';
	import { fade, fly } from 'svelte/transition';
	import { navigation } from '#lib/data/navigation.js';
	import { onMount, tick } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	// helpers
	const cancelClose = () => {
		clearTimeout(closeTimer);
	};
	const close = () => {
		cancelClose();
		activeIndex = -1;
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
	const open = (index: number) => {
		cancelClose();
		if (index === activeIndex) return;
		direction = activeIndex < 0 || index > activeIndex ? 1 : -1;
		activeIndex = index;
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
			desktop.removeEventListener('change', handleBreakpoint);
		};
	});

	// $props()
	let { isReducedMotion = false }: { isReducedMotion?: boolean } = $props();

	// $state
	let activeIndex = $state(-1);
	let closeTimer = $state<ReturnType<typeof setTimeout> | undefined>();
	let direction = $state(1);
	let root = $state<HTMLDivElement | null>(null);

	// $derived
	const activeSection = $derived(navigation[activeIndex]);
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
	{#if activeSection?.children.length}
		<Div
			id="desktop-subnavigation"
			class="absolute top-full left-1/2 w-224 -translate-x-1/2 pt-6"
			transition={[fade, { duration: isReducedMotion ? 0 : 160 }]}
		>
			<Card
				class="relative overflow-hidden p-0 shadow-xl inset-ring-1 inset-ring-gray-200 dark:inset-ring-gray-800"
			>
				<Div class="relative min-h-104">
					{#key activeSection.href}
						<Div
							data-nav-panel
							data-direction={direction}
							class="absolute inset-0 grid grid-cols-3 gap-4 p-8"
							inTransition={[
								fly,
								{ x: isReducedMotion ? 0 : -direction * 48, duration: isReducedMotion ? 0 : 240 }
							]}
							outTransition={[
								fly,
								{ x: isReducedMotion ? 0 : direction * 48, duration: isReducedMotion ? 0 : 160 }
							]}
						>
							<Div
								class="flex flex-col items-start gap-4 rounded-sm bg-gray-50 p-6 dark:bg-gray-950"
							>
								<P class="text-sm font-semibold text-primary-600 dark:text-primary-300">
									Explore {activeSection.label}
								</P>
								<H2 class="text-2xl">{activeSection.description}</H2>
								<A
									href={activeSection.href}
									variants={['ghost', 'accent']}
									class="mt-auto inline-flex items-center gap-2 px-0"
									onclick={close}
								>
									All {activeSection.label.toLowerCase()}<ArrowUpRight
										class="size-4"
										aria-hidden="true"
									/>
								</A>
							</Div>
							<Nav
								aria-label={`${activeSection.label} pages`}
								class="col-span-2 grid grid-cols-2 content-start gap-4"
								aria-labelledby={`nav-trigger-${activeIndex}`}
							>
								{#each activeSection.children as child (child.href)}
									<A
										href={child.href}
										variants={['ghost']}
										class="group block rounded-sm p-4 text-gray-950 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800"
										onclick={close}
									>
										<Span class="flex items-center justify-between gap-2 font-semibold">
											{child.label}<ArrowUpRight
												class="size-4 text-primary-600 dark:text-primary-300"
												aria-hidden="true"
											/>
										</Span>
										<Span
											class="mt-2 block text-sm leading-relaxed text-gray-600 dark:text-gray-300"
										>
											{child.description}
										</Span>
									</A>
								{/each}
							</Nav>
						</Div>
					{/key}
				</Div>
			</Card>
		</Div>
	{/if}
</Div>
