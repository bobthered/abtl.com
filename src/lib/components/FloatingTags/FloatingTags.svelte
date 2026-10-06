<script lang="ts">
	// Imports
	import { Div, Path, Svg } from '#lib/components';
	import { getTagFrames, tags } from './scene.js';
	import { onMount } from 'svelte';
	import { theme } from 'sveltewind/theme';

	// helpers
	const initializeParallax = () => {
		if (!element) return;
		const animations = tags.map((tag) => {
			const node = element!.querySelector<HTMLElement>(`[data-floating-tag="${tag.id}"]`)!;
			const animation = node.animate(getTagFrames(tag), { duration: 1000, fill: 'both' });
			animation.pause();
			animation.currentTime = 0;
			return animation;
		});
		let frame: number | null = null;
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => {
			frame = null;
			const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
			const progress = preference.matches
				? 0
				: Math.min(1, Math.max(0, window.scrollY / scrollRange));
			for (const animation of animations) animation.currentTime = progress * 1000;
		};
		const scheduleUpdate = () => {
			if (frame === null) frame = requestAnimationFrame(update);
		};
		const handleScroll = () => {
			if (!preference.matches) scheduleUpdate();
		};
		const observer = new ResizeObserver(scheduleUpdate);
		observer.observe(document.body);
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', scheduleUpdate);
		preference.addEventListener('change', scheduleUpdate);
		update();
		return () => {
			if (frame !== null) cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', scheduleUpdate);
			preference.removeEventListener('change', scheduleUpdate);
			for (const animation of animations) animation.cancel();
		};
	};

	onMount(initializeParallax);

	// $state
	let element = $state<HTMLDivElement | null>(null);
</script>

<Div bind:element aria-hidden="true" inert class={theme.resolve('floatingTags')}>
	{#each tags as tag (tag.id)}
		<Div
			data-floating-tag={tag.id}
			class={theme.resolve('floatingTag', [tag.depth], `${tag.className} ${tag.color}`)}
		>
			<Svg viewBox="0 0 100 200" aria-hidden="true" focusable="false" class={theme.resolve('tag')}>
				<Path
					d="M12 0H88L100 12V188L88 200H12L0 188V12Z M55 28a5 5 0 1 1-10 0a5 5 0 1 1 10 0Z"
					fill="currentColor"
					fill-rule="evenodd"
				/>
				<Path
					d="M66 28a16 16 0 1 1-32 0a16 16 0 1 1 32 0Z M55 28a5 5 0 1 1-10 0a5 5 0 1 1 10 0Z"
					fill-rule="evenodd"
					variants={['tagPatch']}
				/>
			</Svg>
		</Div>
	{/each}
</Div>
