<script lang="ts">
	// Imports
	import { A, ActionLabel, Br, Div, H1, H2, Main, P } from '#lib/components';
	import { attachmentOptions } from './_components/options';
	import AttachmentSection from './_components/AttachmentSection.svelte';
	import { ContentLayout } from '#lib/layouts';
</script>

<svelte:head>
	<title>Attachments | Allen-Bailey Tag &amp; Label</title>
	<meta
		name="description"
		content="Explore tag patches, brass and zinc eyelets, steel and copper wire, white string and twine, and white or black elastic. Plan the finishing details for your tags."
	/>
</svelte:head>

{#snippet introduction()}
	<P variants={['eyebrow']}>Tag reinforcement &amp; attachments</P>
	<H1 variants={['h2.variant.section']}>Small details.<Br />A stronger connection.</H1>
	<P class="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300">
		The print carries the message. Patches and eyelets reinforce the opening; wire, string, and
		elastic connect the tag to the item. Plan every detail around the way it will be used.
	</P>
	<Div class="mt-8 flex flex-wrap gap-4" role="group" aria-label="Explore tag finishing details">
		{#each attachmentOptions as option (option.id)}
			<A href={`#${option.id}`} variants={['button.base', 'button.variant.neutral-outline']}>
				{option.name}
			</A>
		{/each}
	</Div>
{/snippet}

{#snippet callToAction()}
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Start with the item.<Br />We'll work through the details.
	</H2>

	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		Show us what you need to identify, where the tag will attach, and how it will be handled. We can
		discuss the stock, reinforcement, and fastening together.
	</P>
	<A href="/contact" variants={['button.base', 'button.variant.large', 'button.variant.neutral']}>
		<ActionLabel>Plan your tag with us</ActionLabel>
	</A>
{/snippet}

<Main id="main-content" tabindex={-1}>
	<ContentLayout {callToAction} {introduction}>
		{#each attachmentOptions as option, index (option.id)}
			<AttachmentSection {index} {option} />
		{/each}
	</ContentLayout>
</Main>
