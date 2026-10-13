<script lang="ts">
	// Imports
	import { A, Container, Main, Section } from '#lib/components';
	import NewsPostContent from './_components/NewsPostContent.svelte';
	import type { PageProps } from './$types';

	// $props()
	let { data }: PageProps = $props();
</script>

<svelte:head><meta name="description" content={data.post.description} /></svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container variants={['section']}>
			<A href="/news" class="mb-12" variants={['button.base', 'button.variant.neutral-outline']}>
				All news
			</A>
			<NewsPostContent post={data.post} />
		</Container>
	</Section>
</Main>
