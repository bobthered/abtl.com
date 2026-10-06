<script lang="ts">
	// Imports
	import './layout.css';
	import {
		A,
		Button,
		Circle,
		Container,
		Div,
		Header,
		Nav,
		Path,
		Popover,
		Span,
		Svg
	} from 'sveltewind/components';
	import type { ComponentProps } from 'svelte';
	import favicon from '#lib/assets/favicon.svg';
	import { initializeTheme } from '#lib/theme.js';
	import type { LayoutProps } from './$types';
	import { onMount } from 'svelte';
	import { subtleReveal } from 'sveltewind/transitions';

	// Types
	type ColorMode = 'dark' | 'light';

	// consts
	let isMenuVisible = $state(false);
	let isReducedMotion = $state(false);
	const navigation = [
		{ href: '/#products', label: 'Products' },
		{ href: '/#industries', label: 'Industries' },
		{ href: '/#capabilities', label: 'Capabilities' },
		{ href: '/#resources', label: 'Resources' }
	];

	// helpers
	function applyColorMode(mode: ColorMode) {
		document.documentElement.dataset.theme = mode;
		try {
			localStorage.setItem('theme', mode);
		} catch {
			// The theme still applies when browser storage is unavailable.
		}
	}

	function initializeColorMode() {
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
	}

	function initializeMenuBreakpoint() {
		const desktop = window.matchMedia('(min-width: 1024px)');
		const closeDesktopMenu = () => {
			if (desktop.matches) isMenuVisible = false;
		};
		desktop.addEventListener('change', closeDesktopMenu);
		return () => desktop.removeEventListener('change', closeDesktopMenu);
	}

	function initializeMotionPreference() {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => {
			isReducedMotion = preference.matches;
		};
		updatePreference();
		preference.addEventListener('change', updatePreference);
		return () => preference.removeEventListener('change', updatePreference);
	}

	initializeTheme();
	onMount(initializeColorMode);
	onMount(initializeMenuBreakpoint);
	onMount(initializeMotionPreference);

	// $props()
	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<A href="#main-content" variants={['ghost', 'skip']}>Skip to content</A>
<Header variants={['site']}>
	<Container class="relative flex items-center justify-between gap-6 py-6 lg:py-10">
		<A href="/" aria-label="Allen-Bailey Tag and Label home" variants={['ghost', 'brand']}
			><Span variants={['brandName']}>Allen-Bailey</Span><Span variants={['brandDetail']}
				>Tag & Label</Span
			></A
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
				><Svg viewBox="0 0 32 32" fill="none" aria-hidden="true" class="size-8"
					><Path
						d="M3 5h4l4 18h15l4-13H8"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/><Circle cx="13" cy="28" r="1.5" fill="currentColor" /><Circle
						cx="25"
						cy="28"
						r="1.5"
						fill="currentColor"
					/></Svg
				></Button
			>
		</Div>
		<Div class="lg:hidden">
			<Popover
				bind:isVisible={isMenuVisible}
				trigger={mobileMenuTrigger}
				transition={[subtleReveal, { duration: isReducedMotion ? 0 : 200 }]}
				variants={['navigation']}
			>
				<Nav aria-label="Mobile navigation" class="flex flex-col">
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
			</Popover>
		</Div>
	</Container>
</Header>

{@render children()}

{#snippet mobileMenuTrigger(props: ComponentProps<typeof Button>)}
	<Button {...props} aria-label="Open navigation menu" variants={['ghost', 'icon']}>
		<Svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-6">
			<Path
				d="M4 6h16M4 12h16M4 18h16"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
			/>
		</Svg>
	</Button>
{/snippet}
