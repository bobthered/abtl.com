<script lang="ts">
	// Imports
	import { Div, H1, Img, P, Span, Time } from '#lib/components';
	import type { NewsPost } from '#lib/data/news.js';

	// $props()
	let { headingId, post }: { headingId?: string; post: NewsPost } = $props();
</script>

<Div class="mx-auto max-w-3xl">
	<P class="text-sm font-semibold text-primary-600 dark:text-primary-300"
		>{post.category}{#if !post.isPublished}<Span>/ Preview</Span>{/if}</P
	>
	<H1 id={headingId} class="mt-4 text-4xl tracking-tight sm:text-5xl">{post.title}</H1>
	{#if post.publishedAt}<Time
			datetime={post.publishedAt}
			class="mt-6 block text-sm text-gray-500 dark:text-gray-400"
			>{post.publishedAt.slice(0, 10)}</Time
		>{/if}
	<Img src={post.image} alt={post.alt} class="mt-10 h-auto w-full rounded-sm" />
	<P class="mt-10 text-xl text-gray-600 dark:text-gray-300">{post.description}</P>
	{#each post.body as paragraph, index (index)}<P
			class="mt-6 text-lg text-gray-600 dark:text-gray-300">{paragraph}</P
		>{/each}
</Div>
