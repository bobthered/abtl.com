<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Button,
		Container,
		Div,
		Form,
		H1,
		H2,
		Main,
		P,
		Section
	} from '#lib/components';
	import MarketArtwork from './_components/MarketArtwork.svelte';
	import type { PageProps } from './$types';

	// $props()
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Your Shop | Allen-Bailey</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container class="py-12 sm:py-16">
			<P variants={['eyebrow']}>Customer beta / Your shop</P>
			<H1 variants={['h2.variant.section']}>Welcome, {data.companyName}.</H1>
			<P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
				Choose a market to find the products available to your company. You can return here whenever
				you need to switch.
			</P>
			<Form method="POST" action="/account/sign-out" class="mt-6">
				<Button type="submit" variants={['neutral-outline']}>Sign out</Button>
			</Form>
		</Container>
	</Section>
	<Section variants={['surfaceAlternate']} aria-labelledby="shop-markets-heading">
		<Container class="py-12 sm:py-16">
			<H2 id="shop-markets-heading" class="mb-8 text-3xl">Your markets</H2>
			<Div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each data.markets as market (market.id)}
					<Div
						class="flex flex-col rounded-sm bg-gray-50 p-4 inset-ring-1 inset-ring-gray-200 dark:bg-gray-950 dark:inset-ring-gray-800"
					>
						<MarketArtwork market={market.id} />
						<Div class="flex flex-1 flex-col p-4">
							<H2 class="text-2xl">{market.name}</H2>
							<P class="mt-4 mb-6 text-gray-600 dark:text-gray-300">{market.description}</P>
							{#if market.href}<A
									href={market.href}
									variants={['button.base']}
									class="mt-auto w-fit"
								>
									<ActionLabel>Shop {market.name}</ActionLabel>
								</A>
							{:else}<P class="mt-auto text-sm text-gray-500 dark:text-gray-400">
									Online catalog coming soon
								</P>{/if}
						</Div>
					</Div>
				{:else}<P class="text-gray-600 dark:text-gray-300">
						No markets are available for your account yet. Contact our team to get set up.
					</P>{/each}
			</Div>
			<Div class="mt-12 border-t border-gray-200 pt-6 dark:border-gray-800">
				<P>Need access to another market?</P><A
					href="/contact"
					class="mt-3 inline-block text-primary-600 dark:text-primary-300"
				>
					Contact our team
				</A>
			</Div>
		</Container>
	</Section>
</Main>
