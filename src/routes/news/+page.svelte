<script lang="ts">
	// Imports
	import {
		BentoItem,
		BentoMedia,
		Container,
		Div,
		H1,
		H2,
		Img,
		Main,
		P,
		Section,
		Span
	} from '#lib/components';
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
					<BentoItem href={`/news/${post.id}`} isExpandVisible={false} class="block">
						<BentoMedia class="h-64">
							<Img
								src={post.image}
								alt={post.alt}
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						</BentoMedia>
						<Div class="p-6">
							<P class="text-sm text-primary-600 dark:text-primary-300">
								{post.category}{#if !post.isPublished}
									<Span>/ Preview</Span>
								{/if}
							</P>
							<H2 class="mt-3 text-2xl font-semibold tracking-tight">{post.title}</H2>
							<P class="mt-4 text-gray-600 dark:text-gray-300">{post.description}</P>
						</Div>
					</BentoItem>
				{/each}
			</Div>
		</Container>
	</Section>
</Main>
