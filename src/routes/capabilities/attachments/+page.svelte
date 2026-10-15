<script lang="ts">
	// Imports
	import { A, ActionLabel, Br, Container, Div, H1, H2, Main, P, Section } from '#lib/components';
	import { attachmentOptions } from './_components/options';
	import AttachmentSection from './_components/AttachmentSection.svelte';
</script>

<svelte:head>
	<title>Attachments | Allen-Bailey Tag &amp; Label</title>
	<meta
		name="description"
		content="Explore tag patches, brass and zinc eyelets, steel and copper wire, white string and twine, and white or black elastic. Plan the finishing details for your tags."
	/>
</svelte:head>

<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container class="pt-20 pb-12 sm:pb-16 lg:pt-28">
			<P variants={['eyebrow']}>Tag reinforcement &amp; attachments</P>
			<H1 variants={['h2.variant.section']}>Small details.<Br />A stronger connection.</H1>
			<P class="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300">
				The print carries the message. Patches and eyelets reinforce the opening; wire, string, and
				elastic connect the tag to the item. Plan every detail around the way it will be used.
			</P>
			<Div
				class="mt-8 flex flex-wrap gap-4"
				role="group"
				aria-label="Explore tag finishing details"
			>
				{#each attachmentOptions as option (option.id)}
					<A href={`#${option.id}`} variants={['button.base', 'button.variant.neutral-outline']}>
						{option.name}
					</A>
				{/each}
			</Div>
		</Container>
	</Section>
	{#each attachmentOptions as option, index (option.id)}
		<AttachmentSection {index} {option} />
	{/each}
	<Section variants={['surface']}>
		<Container class="py-12 sm:py-16">
			<Div class="grid items-center gap-4 lg:grid-cols-2">
				<H2 variants={['section']}>Start with the item.<Br />We�ll work through the details.</H2>
				<Div>
					<P class="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
						Show us what you need to identify, where the tag will attach, and how it will be
						handled. We can discuss the stock, reinforcement, and fastening together.
					</P>
					<A href="/contact" variants={['button.base']} class="mt-8">
						<ActionLabel>Plan your tag with us</ActionLabel>
					</A>
				</Div>
			</Div>
		</Container>
	</Section>
</Main>
