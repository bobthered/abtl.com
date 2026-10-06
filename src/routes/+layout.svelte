<script lang="ts">
	// Imports
	import './layout.css';
	import {
		A,
		Button,
		Container,
		Div,
		FloatingTags,
		Footer,
		Header,
		Logo,
		Nav,
		P,
		Popover
	} from '#lib/components';
	import type { ComponentProps } from 'svelte';
	import { createPageTitle } from '#lib/pageTitle.js';
	import { fade } from 'svelte/transition';
	import favicon from '#lib/assets/favicon.svg';
	import faviconDark from '#lib/assets/favicon-dark.svg';
	import { initializeTheme } from '#lib/theme.js';
	import type { LayoutProps } from './$types';
	import { Menu, ShoppingCart, X } from '#lib/icons';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { subtleReveal } from 'sveltewind/transitions';

	// Types
	type ColorMode = 'dark' | 'light';

	// consts
	const navigation = [
		{ href: '/#products', label: 'Products' },
		{ href: '/#industries', label: 'Industries' },
		{ href: '/#capabilities', label: 'Capabilities' },
		{ href: '/#resources', label: 'Resources' }
	];

	// helpers
	const applyColorMode = (mode: ColorMode) => {
		document.documentElement.dataset.theme = mode;
		try {
			localStorage.setItem('theme', mode);
		} catch {
			// The theme still applies when browser storage is unavailable.
		}
	};

	const initializeColorMode = () => {
		let savedMode: string | null = null;
		try {
			savedMode = localStorage.getItem('theme');
		} catch {
			// Fall back to the system preference when browser storage is unavailable.
		}
		applyColorMode(
			savedMode === 'dark' || savedMode === 'light'
				? savedMode
				: window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light'
		);
	};

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
		const desktop = window.matchMedia('(min-width: 1024px)');
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

	initializeTheme();
	onMount(initializeColorMode);
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
	let isNavigationVisible = $state(false);
	let isReducedMotion = $state(false);
	let isScrolled = $state(false);

	// $derived
	const faviconHref = $derived(colorMode === 'dark' ? faviconDark : favicon);
	const pageTitle = $derived(createPageTitle(page.url.pathname));

	// $effects$
	$effect(() => {
		if (!isMenuVisible) {
			isNavigationVisible = false;
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

<A href="#main-content" variants={['ghost', 'skip']}>Skip to content</A>
<FloatingTags />
<Header variants={['site']}>
	<Container
		class={`relative flex items-center justify-between gap-6 py-6 transition-all duration-200 motion-reduce:transition-none ${isScrolled ? 'lg:py-6' : 'lg:py-10'}`}
	>
		<A href="/" aria-label="Allen-Bailey Tag and Label home" variants={['ghost', 'brand']}
			><Logo aria-hidden="true" variants={['onSurface', 'site']} /></A
		>
		<Nav aria-label="Main navigation" class="hidden items-center gap-6 lg:flex xl:gap-12">
			{#each navigation as item (item.href)}<A href={item.href} variants={['ghost', 'navigation']}
					>{item.label}</A
				>{/each}
		</Nav>
		<Div class="hidden items-center gap-8 lg:flex">
			<A
				href="mailto:sales@abtl.com?subject=Tag%20and%20label%20quote"
				variants={['ghost', 'accent']}
				class="hidden xl:inline-flex">Request a Quote</A
			>
			<Button
				type="button"
				disabled
				aria-label="Shopping cart — online store coming soon"
				title="Online store coming soon"
				variants={['ghost', 'icon']}
				class="cursor-not-allowed border-l border-gray-200 pl-6 dark:border-gray-800"
				><ShoppingCart aria-hidden="true" strokeWidth={1.8} class="size-8" /></Button
			>
		</Div>
		<Div class="lg:hidden">
			<Popover
				id="mobile-navigation"
				bind:isVisible={isMenuVisible}
				trigger={mobileMenuTrigger}
				transition={[fade, { duration: isReducedMotion ? 0 : 200 }]}
				variants={['navigation']}
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
						{#each navigation as item (item.href)}
							<A
								href={item.href}
								onclick={() => {
									isMenuVisible = false;
								}}
								variants={['ghost', 'navigation']}>{item.label}</A
							>
						{/each}
						<A
							href="mailto:sales@abtl.com"
							onclick={() => {
								isMenuVisible = false;
							}}
							variants={['ghost', 'accent']}
							class="py-4">Request a Quote</A
						>
					</Nav>
				</Container>
			</Popover>
		</Div>
	</Container>
</Header>

{@render children()}

<Footer variants={['bordered', 'site']}>
	<Container class="space-y-10 py-12 lg:py-16">
		<Div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
			<Div class="space-y-4">
				<A
					href="/"
					aria-label="Allen-Bailey Tag and Label home"
					variants={['ghost', 'brand']}
					class="w-fit items-start"
				>
					<Logo
						aria-hidden="true"
						blueColor="currentColor"
						redColor="currentColor"
						variants={['site']}
					/>
				</A>
				<P variants={['footer']}>Stock and custom tags and labels.</P>
			</Div>
			<Nav aria-label="Footer navigation" class="grid grid-cols-2 gap-x-6">
				{#each navigation as item (item.href)}
					<A href={item.href} variants={['ghost', 'navigation']} class="justify-start"
						>{item.label}</A
					>
				{/each}
			</Nav>
			<Div class="space-y-4">
				<P variants={['eyebrow']}>Let's talk about your project</P>
				<A href="mailto:sales@abtl.com" variants={['ghost', 'accent']}>sales@abtl.com</A>
			</Div>
		</Div>
		<P variants={['footer']}>© {new Date().getFullYear()} Allen-Bailey Tag & Label.</P>
	</Container>
</Footer>

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
