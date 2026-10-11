<script lang="ts">
	// Imports
	import { A, Container, Div, H1, Img, Main, P, Section, Span, Time } from '#lib/components';
	import type { PageProps } from './$types';

	// $props()
	let { data }: PageProps = $props();
</script>

<svelte:head><meta name="description" content={data.post.description} /></svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container variants={['section']}>
			<A href="/news" variants={['button.base', 'button.variant.neutral-outline']}>All news</A>
			<Div class="mx-auto mt-12 max-w-3xl">
				<P class="text-sm font-semibold text-primary-600 dark:text-primary-300"
					>{data.post.category}{#if !data.post.isPublished}<Span>/ Preview</Span>{/if}</P
				>
				<H1 class="mt-4 text-4xl tracking-tight sm:text-5xl">{data.post.title}</H1>
				{#if data.post.publishedAt}<Time
						datetime={data.post.publishedAt}
						class="mt-6 block text-sm text-gray-500 dark:text-gray-400"
						>{data.post.publishedAt.slice(0, 10)}</Time
					>{/if}
				<Img src={data.post.image} alt={data.post.alt} class="mt-10 h-auto w-full rounded-sm" />
				<P class="mt-10 text-xl text-gray-600 dark:text-gray-300">{data.post.description}</P>
				{#each data.post.body as paragraph, index (index)}<P
						class="mt-6 text-lg text-gray-600 dark:text-gray-300">{paragraph}</P
					>{/each}
			</Div>
		</Container>
	</Section>
</Main>
