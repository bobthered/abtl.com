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
	let menuVisible = $state(false);
	const navigation = [
		{ href: '/#products', label: 'Products' },
		{ href: '/#industries', label: 'Industries' },
		{ href: '/#capabilities', label: 'Capabilities' },
		{ href: '/#resources', label: 'Resources' }
	];

	let reducedMotion = $state(false);

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
		const desktop = window.matchMedia('(min-width: 801px)');
		const closeDesktopMenu = () => {
			if (desktop.matches) menuVisible = false;
		};
		desktop.addEventListener('change', closeDesktopMenu);
		return () => desktop.removeEventListener('change', closeDesktopMenu);
	}

	function initializeMotionPreference() {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => {
			reducedMotion = preference.matches;
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

<A
	href="#main-content"
	class="fixed top-3 left-3 z-30 -translate-y-[160%] bg-white px-5 py-3 text-[#5300ff] no-underline focus:translate-y-0 dark:bg-gray-950 dark:text-violet-300"
	>Skip to content</A
>
<Header class="border-b-0">
	<Container
		class="relative flex items-center justify-between gap-7 border-b-0 py-11 max-[1100px]:gap-5 max-[1100px]:py-[30px] max-[800px]:py-[26px]"
	>
		<A
			href="/"
			aria-label="Allen-Bailey Tag and Label home"
			class="flex shrink-0 flex-col items-center gap-1 text-[#101014] no-underline dark:text-gray-50"
			><Span class="text-[30px] leading-none font-[750] tracking-[-1.6px] max-[1100px]:text-[25px]"
				>Allen-Bailey</Span
			><Span class="text-[10px] font-bold tracking-[4px] uppercase">Tag & Label</Span></A
		>
		<Nav
			aria-label="Main navigation"
			class="flex items-center gap-[clamp(20px,3.2vw,48px)] max-[1100px]:gap-5 max-[800px]:hidden"
		>
			{#each navigation as item (item.href)}<A
					href={item.href}
					class="py-3 text-[15px] font-medium text-[#17182b] no-underline hover:text-[#5300ff] dark:text-gray-50 dark:hover:text-violet-200"
					>{item.label}</A
				>{/each}
		</Nav>
		<Div class="flex items-center gap-8 max-[1100px]:gap-5 max-[800px]:hidden">
			<A
				href="mailto:sales@abtl.com?subject=Tag%20and%20label%20quote"
				class="text-[15px] font-medium whitespace-nowrap text-[#5300ff] no-underline max-[1100px]:hidden dark:text-violet-300"
				>Request a Quote</A
			>
			<Button
				type="button"
				disabled
				aria-label="Shopping cart — online store coming soon"
				title="Online store coming soon"
				class="cursor-not-allowed rounded-none border-0 border-l border-[#d7d7df] bg-transparent p-0 pl-[30px] text-[#101014] opacity-100 shadow-none disabled:opacity-100 max-[1100px]:pl-5 dark:border-gray-800 dark:text-gray-50"
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
		<Div class="hidden max-[800px]:block">
			<Popover
				bind:isVisible={menuVisible}
				trigger={mobileMenuTrigger}
				transition={[subtleReveal, { duration: reducedMotion ? 0 : 200 }]}
				class="w-[min(320px,calc(100vw-40px))] rounded-2xl border border-[#e0e0e8] bg-white px-6 py-4 shadow-[0_12px_32px_#16132612] min-[801px]:hidden dark:border-gray-800 dark:bg-gray-950"
			>
				<Nav aria-label="Mobile navigation" class="flex flex-col">
					{#each navigation as item (item.href)}
						<A
							href={item.href}
							onclick={() => {
								menuVisible = false;
							}}
							class="py-3 text-[15px] font-medium text-[#17182b] no-underline hover:text-[#5300ff] dark:text-gray-50 dark:hover:text-violet-200"
							>{item.label}</A
						>
					{/each}
					<A
						href="mailto:sales@abtl.com"
						onclick={() => {
							menuVisible = false;
						}}
						class="py-4 text-[15px] font-medium whitespace-nowrap text-[#5300ff] no-underline dark:text-violet-300"
						>Request a Quote</A
					>
				</Nav>
			</Popover>
		</Div>
	</Container>
</Header>

{@render children()}

{#snippet mobileMenuTrigger(props: ComponentProps<typeof Button>)}
	<Button
		{...props}
		aria-label="Open navigation menu"
		class="border-0 bg-transparent p-2 text-[#101014] shadow-none hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-900 dark:hover:text-gray-50"
	>
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
