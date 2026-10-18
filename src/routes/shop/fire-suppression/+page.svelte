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
	import type { PageProps } from './$types';

	// consts
	const categories = [
		{ name: 'Tags', copy: 'Inspection, alarm, back flow, empty / in use, and service tags.' },
		{
			name: 'Labels',
			copy: 'Maintenance, service, emergency light, HMIS, hood cleaning, hydrostatic test, and DOT 1044 labels.'
		},
		{ name: 'Collars', copy: 'Extinguisher neck collars for your service program.' }
	];

	// $props()
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Fire Suppression Shop | Allen-Bailey</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container class="py-12 sm:py-16">
			<P variants={['eyebrow']}>Beta shop / Fire Suppression</P>
			<P class="my-4 text-sm text-gray-600 dark:text-gray-300">Demo workspace / No live ordering</P>
			<H1 variants={['h2.variant.section']}>Welcome, {data.companyName}.</H1>
			<Form method="POST" action="/account/sign-out" class="mt-6">
				<Button type="submit" variants={['neutral-outline']}>Sign out</Button>
			</Form>
			<P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
				Your fire-service products, together in one place. Online ordering is being prepared for the
				beta.
			</P>
		</Container>
	</Section>
	<Section variants={['surfaceAlternate']}>
		<Container class="py-12 sm:py-16">
			<Div class="grid gap-4 md:grid-cols-3">
				{#each categories as category (category.name)}
					<Div
						class="rounded-sm bg-gray-50 p-8 inset-ring-1 inset-ring-gray-200 dark:bg-gray-950 dark:inset-ring-gray-800"
					>
						<H2 class="text-2xl">{category.name}</H2><P
							class="mt-4 text-gray-600 dark:text-gray-300"
						>
							{category.copy}
						</P>
					</Div>
				{/each}
			</Div>
			<P class="mt-8">Need something while we prepare your catalog?</P>
			<A href="/contact" variants={['button.base']} class="mt-4">
				<ActionLabel>Contact our team</ActionLabel>
			</A>
		</Container>
	</Section>
</Main>
