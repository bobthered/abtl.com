<script lang="ts">
	// Imports
	import './layout.css';
	import {
		A,
		Button,
		Container,
		Div,
		Footer,
		Header,
		Img,
		Logo,
		Nav,
		P,
		Popover,
		SiteNavigation
	} from '#lib/components';
	import { browser } from '$app/env';
	import { ChevronDown, Menu, X } from '#lib/icons';
	import type { ComponentProps } from 'svelte';
	import { allNavigation, contactNavigation } from '#lib/data/navigation.js';
	import { createPageTitle } from '#lib/pageTitle.js';
	import { fade, slide } from 'svelte/transition';
	import favicon from '#lib/assets/favicon.svg';
	import faviconDark from '#lib/assets/favicon-dark.svg';
	import { initializeTheme } from '#lib/theme.js';
	import type { LayoutProps } from './$types';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { scrollReveal, setScrollRevealNavigation } from '#lib/attachments';
	import { subtleReveal } from 'sveltewind/transitions';
	import { twMerge } from 'tailwind-merge';

	// Types
	type ColorMode = 'dark' | 'light';

	// consts
	const footerClass = 'text-sm leading-relaxed';
	// Capture request state during component initialization for async server rendering.
	const initialPathname = page.url.pathname;

	const mobileLinkClass =
		'flex min-h-11 w-full items-center justify-start px-0 py-3 text-sm font-medium';

	const siteFrameClass =
		'[--site-header-height:calc(var(--spacing)*24+1px)] sm:[--site-header-height:calc(var(--spacing)*26+1px)] lg:[--site-header-height:calc(var(--spacing)*34+1px)]';

	// helpers
	const initializeFaviconTheme = () => {
		const updateFaviconTheme = () => {
			colorMode = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
		};
		updateFaviconTheme();
		const observer = new MutationObserver(updateFaviconTheme);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});
		return () => observer.disconnect();
	};

	const initializeMenuBreakpoint = () => {
		const desktop = window.matchMedia('(min-width: 1280px)');
		const closeDesktopMenu = () => {
			if (desktop.matches) isMenuVisible = false;
		};
		desktop.addEventListener('change', closeDesktopMenu);
		return () => desktop.removeEventListener('change', closeDesktopMenu);
	};

	const initializeMotionPreference = () => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => {
			isReducedMotion = preference.matches;
		};
		updatePreference();
		preference.addEventListener('change', updatePreference);
		return () => preference.removeEventListener('change', updatePreference);
	};

	onNavigate(() => {
		setScrollRevealNavigation(true);
		return () => setScrollRevealNavigation(false);
	});

	initializeTheme();
	onMount(initializeFaviconTheme);
	onMount(initializeMenuBreakpoint);
	onMount(initializeMotionPreference);
	onMount(() => {
		const updateScroll = () => {
			isScrolled = window.scrollY > 0;
		};
		updateScroll();
		window.addEventListener('scroll', updateScroll, { passive: true });
		return () => window.removeEventListener('scroll', updateScroll);
	});

	// $props()
	let { children }: LayoutProps = $props();

	// $state
	let colorMode = $state<ColorMode>('light');
	let isMenuVisible = $state(false);
	let isMobileSubmenuVisible = $state<Record<string, boolean>>({});
	let isNavigationVisible = $state(false);
	let isReducedMotion = $state(false);
	let isScrolled = $state(false);

	// $derived
	const faviconHref = $derived(colorMode === 'dark' ? faviconDark : favicon);
	const pageTitle = $derived(
		createPageTitle(browser ? (page.shallow?.url ?? page.url).pathname : initialPathname)
	);

	// $effects
	$effect(() => {
		if (!isMenuVisible) {
			isNavigationVisible = false;
			isMobileSubmenuVisible = {};
			return;
		}
		// Start the nested transition after Popover has mounted its content.
		queueMicrotask(() => {
			isNavigationVisible = isMenuVisible;
		});
	});

	$effect(() => {
		if (!isMenuVisible) return;
		const root = document.documentElement;
		const isAlreadyLocked = root.classList.contains('overflow-hidden');
		root.classList.add('overflow-hidden');
		return () => {
			if (!isAlreadyLocked) root.classList.remove('overflow-hidden');
		};
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<link rel="icon" type="image/svg+xml" sizes="any" href={faviconHref} />
</svelte:head>

<A
	href="#main-content"
	variants={['ghost']}
	class="fixed top-3 left-3 z-30 -translate-y-24 rounded-sm bg-gray-50 px-5 py-3 text-primary-600 focus:translate-y-0 dark:bg-gray-950 dark:text-primary-300"
>
	Skip to content
</A>
<Div
	{@attach scrollReveal}
	class={twMerge(
		siteFrameClass,
		isScrolled ? 'lg:[--site-header-height:calc(var(--spacing)*22+1px)]' : ''
	)}
>
	<Header
		class="sticky top-0 z-20 border-0 border-b border-gray-200 bg-white backdrop-blur-none dark:border-gray-800 dark:bg-gray-950"
	>
		<Container
			class={twMerge(
				'min-h-[calc(var(--site-header-height)-1px)]',
				'relative flex items-center justify-between gap-3 py-6 transition-all duration-200 motion-reduce:transition-none sm:gap-6',
				isScrolled ? 'lg:py-4' : 'lg:py-10'
			)}
		>
			<A href="/" aria-label="Allen-Bailey Tag and Label home" variants={['ghost', 'brand']}>
				<Logo aria-hidden="true" variants={['onSurface', 'site']} />
			</A>
			<SiteNavigation {isReducedMotion} />
			<Div class="hidden items-center gap-2 xl:flex">
				<A href={contactNavigation.href} variants={['ghost', 'navigation']} class="px-0 sm:px-3">
					Contact
				</A>
				<Button
					type="button"
					disabled
					title="Sign in coming soon"
					aria-label="Sign In (coming soon)"
				>
					Sign In
				</Button>
			</Div>
			<Div class="xl:hidden">
				<Popover
					id="mobile-navigation"
					bind:isVisible={isMenuVisible}
					trigger={mobileMenuTrigger}
					transition={[fade, { duration: isReducedMotion ? 0 : 200 }]}
					class="inset-0! m-0! h-dvh max-h-none w-full max-w-none overflow-y-auto rounded-none bg-white p-0 shadow-none inset-ring-0 data-anchored:[position-anchor:auto] data-anchored:[position-area:none] xl:hidden dark:bg-gray-950"
				>
					<Container class="flex items-center justify-between gap-6 py-6">
						<A
							href="/"
							onclick={() => {
								isMenuVisible = false;
							}}
							aria-label="Allen-Bailey Tag and Label home"
							variants={['ghost', 'brand']}
						>
							<Logo aria-hidden="true" variants={['onSurface', 'site']} />
						</A>
						{@render mobileMenuTrigger({
							onclick: () => {
								isMenuVisible = false;
							},
							'aria-controls': 'mobile-navigation',
							'aria-expanded': true
						})}
					</Container>
					<Container>
						<Nav
							aria-label="Mobile navigation"
							class="flex flex-col"
							isVisible={isNavigationVisible}
							transition={[subtleReveal, { duration: isReducedMotion ? 0 : 200 }]}
						>
							{#each allNavigation as item (item.href)}
								{#if item.children.length}
									<Div class="border-b border-gray-200 dark:border-gray-800">
										<Button
											type="button"
											variants={['ghost']}
											class={twMerge(mobileLinkClass, 'justify-between')}
											aria-expanded={isMobileSubmenuVisible[item.href] ?? false}
											aria-controls={isMobileSubmenuVisible[item.href]
												? `mobile-submenu-${item.label.toLowerCase()}`
												: undefined}
											onclick={() =>
												(isMobileSubmenuVisible[item.href] = !isMobileSubmenuVisible[item.href])}
										>
											{item.label}<ChevronDown
												class={twMerge(
													'size-4 transition-transform duration-200 motion-reduce:transition-none',
													isMobileSubmenuVisible[item.href] ? 'rotate-180' : ''
												)}
												aria-hidden="true"
											/>
										</Button>
										<Div
											id={`mobile-submenu-${item.label.toLowerCase()}`}
											isVisible={isMobileSubmenuVisible[item.href] ?? false}
											transition={[slide, { duration: isReducedMotion ? 0 : 240 }]}
											class="flex flex-col gap-2 pb-4 pl-4"
										>
											<A
												href={item.href}
												variants={['ghost', 'navigation']}
												class="justify-start"
												onclick={() => (isMenuVisible = false)}
											>
												All {item.label.toLowerCase()}
											</A>
											{#each item.children as child (child.href)}
												<A
													href={child.href}
													variants={['ghost', 'navigation']}
													class="justify-start"
													onclick={() => (isMenuVisible = false)}
												>
													{child.label}
												</A>
											{/each}
										</Div>
									</Div>
								{:else}
									<A
										href={item.href}
										variants={['ghost', 'navigation']}
										class={mobileLinkClass}
										onclick={() => (isMenuVisible = false)}
									>
										{item.label}
									</A>
								{/if}
							{/each}
							<Button
								type="button"
								disabled
								title="Sign in coming soon"
								aria-label="Sign In (coming soon)"
								class="mt-4 w-fit"
							>
								Sign In
							</Button>
						</Nav>
					</Container>
				</Popover>
			</Div>
		</Container>
	</Header>

	{@render children()}

	<Footer
		class="relative z-10 p-0 [&_a]:rounded-sm [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-primary-600 dark:[&_a:focus-visible]:outline-primary-300"
	>
		<Container class="relative z-10 space-y-10 py-12 lg:py-16">
			<Div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Div class="space-y-4">
					<A
						href="/"
						aria-label="Allen-Bailey Tag and Label home"
						variants={['ghost', 'brand']}
						class="w-fit items-start"
					>
						<Logo
							aria-hidden="true"
							variants={['onSurface', 'site']}
						/>
					</A>
					<P class={footerClass}>Stock and custom tags and labels.</P>
				</Div>
				<Div>
					<Nav aria-label="Footer navigation" class="grid grid-cols-2 gap-4">
						{#each allNavigation as item (item.label)}
							<A href={item.href} variants={['ghost', 'navigation']} class="justify-start">
								{item.label}
							</A>
						{/each}
					</Nav>
				</Div>
				<Div class="space-y-4">
					<P variants={['eyebrow']}>Let's talk about your project</P>
					<A href="mailto:sales@abtl.com" variants={['ghost']}>sales@abtl.com</A>
				</Div>
			</Div>
			<P class={footerClass}>© {new Date().getFullYear()} Allen-Bailey Tag & Label.</P>
		</Container>
		<Img
			src="/images/footer/footer-landscape-v2.webp"
			alt="Rolling hills and a winding road lined with tagged Christmas trees, with a delivery truck carrying label rolls and a tagged fire extinguisher"
			width={2172}
			height={724}
			loading="lazy"
			decoding="async"
			class="pointer-events-none -mt-28 block h-64 w-full object-cover object-right sm:-mt-32 sm:h-auto lg:-mt-52 xl:-mt-56 2xl:-mt-72"
		/>
	</Footer>
</Div>

{#snippet mobileMenuTrigger(props: ComponentProps<typeof Button>)}
	<Button
		{...props}
		aria-label={isMenuVisible ? 'Close navigation menu' : 'Open navigation menu'}
		variants={['ghost', 'icon']}
	>
		{#if isMenuVisible}
			<X aria-hidden="true" strokeWidth={1.6} class="size-6" />
		{:else}
			<Menu aria-hidden="true" strokeWidth={1.6} class="size-6" />
		{/if}
	</Button>
{/snippet}
