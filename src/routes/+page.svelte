<script lang="ts">
	// Imports
	import BentoSection from './_components/BentoSection/BentoSection.svelte';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { Main } from '#lib/components';
	import NewsHighlights from './_components/NewsHighlights/NewsHighlights.svelte';
	import type { NewsPost } from '#lib/data/news.js';
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import ProductionMetrics from './_components/ProductionMetrics/ProductionMetrics.svelte';
	import SiteHero from './_components/SiteHero/SiteHero.svelte';
	import { type Topic, topicHref } from '#lib/data/topics.js';

	// helpers
	const navigateNews = (post: NewsPost | null) => {
		if (post) void goto(`/news/${post.id}`, { shallow: true, state: { newsPost: post.id } });
		else if (page.shallow && page.state.newsPost) history.back();
	};
	const navigateTopic = (topic: Topic | null) => {
		if (topic) void goto(topicHref(topic), { shallow: true, state: { bentoTopic: topic.id } });
		else if (page.shallow && page.state.bentoTopic) history.back();
	};

	// $props()
	let { data }: PageProps = $props();

	// $derived
	const postId = $derived(browser && page.shallow ? (page.state.newsPost ?? null) : null);
	const topicId = $derived(browser && page.shallow ? (page.state.bentoTopic ?? null) : null);
</script>

<Main id="main-content" tabindex={-1}>
	<SiteHero />
	<BentoSection orderedTopics={data.bentoTopics} {topicId} onNavigate={navigateTopic} />
	<ProductionMetrics />
	<NewsHighlights {postId} onNavigate={navigateNews} />
</Main>
