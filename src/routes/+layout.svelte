<script lang="ts">
	// Imports
	import './layout.css';
	import {
		A,
		Button,
		Circle,
		Container,
		Details,
		Div,
		Header,
		Nav,
		Path,
		Span,
		Summary,
		Svg
	} from 'sveltewind/components';
	import favicon from '#lib/assets/favicon.svg';
	import { initializeTheme } from '#lib/theme.js';
	import type { LayoutProps } from './$types';
	import { onMount } from 'svelte';

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

	initializeTheme();
	onMount(initializeColorMode);

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
		<Details class="hidden rounded-none border-0 bg-transparent p-0 max-[800px]:block">
			<Summary
				class="cursor-pointer list-none bg-transparent p-2 [&::-webkit-details-marker]:hidden"
				aria-label="Open navigation menu"
				><Svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-6"
					><Path
						d="M4 6h16M4 12h16M4 18h16"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
					/></Svg
				></Summary
			>
			<Nav
				aria-label="Mobile navigation"
				class="absolute inset-x-0 top-[calc(100%-8px)] z-10 flex flex-col rounded-2xl border border-[#e0e0e8] bg-white px-6 py-4 shadow-[0_12px_32px_#16132612] dark:border-gray-800 dark:bg-gray-950 [&>a:last-child]:py-4"
				>{#each navigation as item (item.href)}<A
						href={item.href}
						class="py-3 text-[15px] font-medium text-[#17182b] no-underline hover:text-[#5300ff] dark:text-gray-50 dark:hover:text-violet-200"
						>{item.label}</A
					>{/each}<A
					href="mailto:sales@abtl.com"
					class="text-[15px] font-medium whitespace-nowrap text-[#5300ff] no-underline dark:text-violet-300"
					>Request a Quote</A
				></Nav
			>
		</Details>
	</Container>
</Header>

{@render children()}
