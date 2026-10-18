<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Address,
		Br,
		Container,
		Div,
		H1,
		H2,
		H3,
		Main,
		P,
		Section,
		Span
	} from '#lib/components';
	import { contactDetails } from '#lib/data/contact.js';
	import ContactMap from './_components/ContactMap.svelte';
	import { ContentLayout } from '#lib/layouts';
	import InquiryForm from './_components/InquiryForm.svelte';
	import { Mail, Phone } from '#lib/icons';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	// $props()
	let { data, form }: PageProps = $props();

	// $state
	let isReady = $state(false);

	// $effects
	onMount(() => {
		isReady = true;
	});
</script>

<svelte:head>
	<title>Contact | Allen-Bailey Tag &amp; Label</title>
	<meta
		name="description"
		content="Start a tag or label project with Allen-Bailey. Send an inquiry, contact our sales team, or find our address at 3177 Lehigh St., Caledonia, New York."
	/>
</svelte:head>
{#snippet introduction()}
	<P variants={['eyebrow']}>Contact / Let's make a start</P>
	<H1 variants={['h2.variant.section']}>Bring us the details.<Br />Or just the idea.</H1>
	<P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
		A new tag, a different label, or a question about what comes next. Tell us what you're working
		on, and give our team a place to start.
	</P>
{/snippet}
{#snippet callToAction()}
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">Prefer a conversation?</P>
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Talk it through.<Br />Find your next step.
	</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		A question, a sample, or an idea is enough to begin. Call our team to talk about what you have
		in mind.
	</P>
	<A
		href={contactDetails.phoneHref}
		variants={['button.base', 'button.variant.large', 'button.variant.neutral']}
	>
		<ActionLabel>Call {contactDetails.phone}</ActionLabel>
	</A>
{/snippet}

<Main id="main-content" tabindex={-1} data-contact-ready={isReady}>
	<ContentLayout {callToAction} {introduction}>
		<Section
			id="contact-inquiry"
			variants={['surfaceAlternate']}
			aria-labelledby="contact-inquiry-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-start gap-4 lg:grid-cols-5">
					<Div class="py-6 lg:col-span-2 lg:pr-12">
						<P variants={['eyebrow']}>01 / A conversation worth starting</P><H2
							id="contact-inquiry-heading"
							class="text-4xl font-light sm:text-5xl"
						>
							No finished brief?<Br />Start here anyway.
						</H2><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Share what the tag or label needs to do. If you know the size, quantity, artwork, or
							timing, include it. If you don't, tell us about the application.
						</P><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Distributors and direct customers are welcome. Our team can help work through the
							details with you.
						</P>
						<Div class="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
							<Mail
								class="mb-3 size-5 text-primary-600 dark:text-primary-300"
								aria-hidden="true"
							/><H3 class="text-xl font-medium">Prefer to email?</H3><A
								href={`mailto:${contactDetails.email}`}
								variants={['button.base']}
								class="mt-3"
							>
								<ActionLabel>{contactDetails.email}</ActionLabel>
							</A><P class="mt-3 text-sm text-gray-600 dark:text-gray-300">
								Send a photo, existing sample details, or artwork with your message.
							</P>
						</Div>
					</Div>
					<Div class="lg:col-span-3">
						<InquiryForm {form} isDeliveryConfigured={data.isDeliveryConfigured} />
					</Div>
				</Div>
			</Container>
		</Section>

		<Section
			id="contact-location"
			variants={['surface']}
			aria-labelledby="contact-location-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<ContactMap apiKey={data.googleMapsApiKey} />
					<Div class="py-6 lg:pl-12">
						<P variants={['eyebrow']}>02 / Find us in Caledonia</P><H2
							id="contact-location-heading"
							class="text-4xl font-light sm:text-5xl"
						>
							A real place.<Br />Real people behind the print.
						</H2><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Our home is in Caledonia, New York. Whether you're starting a project or sending a
							sample, here's where to find our team.
						</P>
						<Address class="mt-8 not-italic">
							<P class="font-medium">{contactDetails.company}</P><P
								class="mt-2 text-gray-600 dark:text-gray-300"
							>
								{contactDetails.street}<Br />{contactDetails.locality}
							</P>
						</Address>
						<A
							href={contactDetails.mapsHref}
							target="_blank"
							rel="noopener noreferrer"
							variants={['button.base', 'button.variant.neutral-outline']}
							class="mt-6"
						>
							<ActionLabel>
								Open directions<Span class="sr-only">(opens a new tab)</Span>
							</ActionLabel>
						</A>
						<Div class="mt-8 grid gap-4 sm:grid-cols-2">
							<Div>
								<Phone
									class="mb-3 size-5 text-primary-600 dark:text-primary-300"
									aria-hidden="true"
								/><P class="text-sm text-gray-500 dark:text-gray-400">Call our team</P><A
									href={contactDetails.phoneHref}
									class="mt-2 inline-flex text-lg underline underline-offset-4"
								>
									{contactDetails.phone}
								</A>
							</Div><Div>
								<Mail
									class="mb-3 size-5 text-primary-600 dark:text-primary-300"
									aria-hidden="true"
								/><P class="text-sm text-gray-500 dark:text-gray-400">Email sales</P><A
									href={`mailto:${contactDetails.email}`}
									variants={['button.base']}
									class="mt-2"
								>
									{contactDetails.email}
								</A>
							</Div>
						</Div>
						<P class="mt-8 text-sm text-gray-500 dark:text-gray-400">
							Sending a sample? Include your name, contact details, and a note about the project so
							we can connect it with your inquiry.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
	</ContentLayout>
</Main>
