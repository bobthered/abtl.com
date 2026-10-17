<script lang="ts">
	// Imports
	import { A, ActionLabel, Br, H1, H2, P } from '#lib/components';
	import { attachmentOptions } from './options';
	import AttachmentSection from './AttachmentSection.svelte';
	import { ContentLayout } from '#lib/layouts';

	// $props()
	let { isStandalone = true }: { isStandalone?: boolean } = $props();
</script>

{#snippet introduction()}
	<P variants={['eyebrow']}>Tag reinforcement &amp; attachments</P>
	{#if isStandalone}
		<H1 id="bento-dialog-heading" variants={['h2.variant.section']}>
			Small details.<Br />A stronger connection.
		</H1>
	{:else}
		<H2 id="bento-dialog-heading" variants={['section']}>
			Small details.<Br />A stronger connection.
		</H2>
	{/if}
	<P id="bento-dialog-description" class="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300">
		The print carries the message. Patches and eyelets reinforce the opening; wire, string, and
		elastic connect the tag to the item. Plan every detail around the way it will be used.
	</P>
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

<ContentLayout {callToAction} {introduction} {isStandalone}>
	{#each attachmentOptions as option, index (option.id)}
		<AttachmentSection {index} {isStandalone} {option} />
	{/each}
</ContentLayout>
