<script lang="ts">
	// Imports
	import './layout.css';
	import {
		A,
		Button,
		Circle,
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

	// consts
	const navigation = [
		{ href: '/#products', label: 'Products' },
		{ href: '/#industries', label: 'Industries' },
		{ href: '/#capabilities', label: 'Capabilities' },
		{ href: '/#resources', label: 'Resources' }
	];

	// helpers
	initializeTheme();

	// $props()
	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<A href="#main-content" class="skip-link">Skip to content</A>
<Header class="site-header page-width">
	<A href="/" aria-label="Allen-Bailey Tag and Label home" class="wordmark"
		><Span class="wordmark-name">Allen-Bailey</Span><Span class="wordmark-detail">Tag & Label</Span
		></A
	>
	<Nav aria-label="Main navigation" class="desktop-navigation">
		{#each navigation as item (item.href)}<A href={item.href} class="navigation-link"
				>{item.label}</A
			>{/each}
	</Nav>
	<Div class="header-actions">
		<A href="mailto:sales@abtl.com?subject=Tag%20and%20label%20quote" class="header-quote"
			>Request a Quote</A
		>
		<Button
			type="button"
			disabled
			aria-label="Shopping cart — online store coming soon"
			title="Online store coming soon"
			class="cart-button"
			><Svg viewBox="0 0 32 32" fill="none" aria-hidden="true" class="cart-icon"
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
	<Details class="mobile-menu">
		<Summary class="mobile-menu-trigger" aria-label="Open navigation menu"
			><Svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="menu-icon"
				><Path
					d="M4 6h16M4 12h16M4 18h16"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
				/></Svg
			></Summary
		>
		<Nav aria-label="Mobile navigation" class="mobile-navigation"
			>{#each navigation as item (item.href)}<A href={item.href} class="navigation-link"
					>{item.label}</A
				>{/each}<A href="mailto:sales@abtl.com" class="header-quote">Request a Quote</A></Nav
		>
	</Details>
</Header>

{@render children()}
