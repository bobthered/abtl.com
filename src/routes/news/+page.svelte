<script lang="ts">
	// Imports
	import { A, Container, Div, H1, H2, Img, Main, P, Section, Span } from '#lib/components';
	import type { PageProps } from './$types';

	// $props()
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<meta
		name="description"
		content="News, stories and perspectives from Allen-Bailey Tag & Label."
	/>
</svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container variants={['section']}>
			<Div class="mb-12 max-w-2xl">
				<P class="mb-4 text-sm font-semibold text-primary-600 dark:text-primary-300">
					From the newsroom
				</P>
				<H1 class="text-4xl tracking-tight sm:text-5xl">News & perspectives.</H1>
				<P class="mt-6 text-lg text-gray-600 dark:text-gray-300">
					Stories, ideas and updates from the world of tags and labels.
				</P>
			</Div>
			<Div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-news-grid>
				{#each data.posts as post (post.id)}
					<A
						href={`/news/${post.id}`}
						class="group block min-w-0 overflow-hidden rounded-sm bg-white text-gray-950 inset-ring-1 inset-ring-gray-200 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 dark:bg-gray-900 dark:text-gray-50 dark:inset-ring-gray-800 dark:hover:text-gray-50 dark:focus-visible:outline-primary-300"
					>
						<Div class="flex h-64 items-center justify-center overflow-hidden">
							<Img
								src={post.image}
								alt={post.alt}
								class="h-auto w-160 max-w-none shrink-0"
								loading="lazy"
							/>
						</Div>
						<Div class="p-6">
							<P class="text-sm text-primary-600 dark:text-primary-300">
								{post.category}{#if !post.isPublished}
									<Span>/ Preview</Span>
								{/if}
							</P>
							<H2 class="mt-3 text-2xl font-semibold tracking-tight">{post.title}</H2>
							<P class="mt-4 text-gray-600 dark:text-gray-300">{post.description}</P>
						</Div>
					</A>
				{/each}
			</Div>
		</Container>
	</Section>
</Main>
