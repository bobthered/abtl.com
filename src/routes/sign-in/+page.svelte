<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Br,
		Button,
		Container,
		Div,
		Form,
		H1,
		H2,
		Input,
		Label,
		Main,
		P,
		Section,
		Select
	} from '#lib/components';
	import { ArrowRight, ShieldCheck } from '#lib/icons';
	import { betaMarkets } from './_lib/invitations';
	import { contactDetails } from '#lib/data/contact.js';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { requestInvitation } from './invitation.remote';
	import { signIn } from './sign-in.remote';

	// $props()
	let { data }: PageProps = $props();

	// $state
	let isReady = $state(false);

	// $effects
	onMount(() => {
		isReady = true;
	});
</script>

<svelte:head>
	<title>Beta Shop Sign In | Allen-Bailey</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>
<Main id="main-content" tabindex={-1} data-sign-in-ready={isReady}>
	<Section variants={['surface']}>
		<Container class="py-12 sm:py-16 lg:py-28">
			<Div class="grid items-center gap-4 lg:grid-cols-2">
				<Div class="lg:pr-12">
					<P variants={['eyebrow']}>Allen-Bailey / Customer beta</P><H1
						variants={['h2.variant.section']}
					>
						Your next order.<Br />A simpler start.
					</H1><P class="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300">
						A dedicated shop for the products your team uses. Access is by invitation while we build
						the experience with our beta customers.
					</P><A
						href="/markets/fire-suppression"
						class="mt-6 inline-flex items-center gap-2 text-primary-600 dark:text-primary-300"
					>
						Explore fire suppression<ArrowRight class="size-4" aria-hidden="true" />
					</A>
					<Div class="mt-8">
						<A href="#request-beta" variants={['button.base']}>
							<ActionLabel>Request a beta invitation</ActionLabel>
						</A>
					</Div>
				</Div>
				<Div
					class="rounded-sm bg-white p-8 shadow-sm inset-ring-1 inset-ring-gray-200 sm:p-12 dark:bg-gray-900 dark:inset-ring-gray-800"
				>
					<ShieldCheck class="mb-6 size-8 text-primary-500" aria-hidden="true" /><H2
						class="text-3xl"
					>
						Invited customers only.
					</H2>
					<P class="mt-4 text-gray-600 dark:text-gray-300">Sign in to your company's shop.</P>
					{#each signIn.fields.allIssues() ?? [] as issue, index (index)}<P
							role="alert"
							class="mt-4 text-red-600 dark:text-red-300"
						>
							{issue.message}
						</P>{/each}
					<Form {...signIn} aria-label="Shop sign in" class="mt-6 grid gap-4">
						<Div>
							<Label for="shop-email">Work email</Label><Input
								id="shop-email"
								{...signIn.fields.email.as('email')}
								autocomplete="username"
								required
								maxlength={254}
								class="mt-2 w-full"
							/>
						</Div>
						<Div>
							<Label for="shop-password">Password</Label><Input
								id="shop-password"
								{...signIn.fields._password.as('password')}
								autocomplete="current-password"
								required
								maxlength={128}
								class="mt-2 w-full"
							/>
						</Div>
						<Button type="submit" disabled={!data.isDemoEnabled || signIn.pending > 0}>
							Sign in
						</Button>
					</Form>
					{#if data.demoCredentials}
						<Div
							class="mt-6 rounded-sm bg-gray-50 p-4 inset-ring-1 inset-ring-gray-200 dark:bg-gray-950 dark:inset-ring-gray-800"
						>
							<P class="text-sm font-medium">Temporary demo access</P>
							<P class="mt-2 text-sm break-all">Email: {data.demoCredentials.email}</P>
							<P class="mt-1 text-sm">Password: {data.demoCredentials.password}</P>
							<P class="mt-2 text-sm text-gray-600 dark:text-gray-300">
								Development preview only. No real orders or customer information.
							</P>
						</Div>
					{:else}<P class="mt-4 text-sm">Customer sign-in is not available yet.</P>{/if}
					<A href="/contact" class="mt-6 inline-block">Need help accessing your account?</A>
					<P class="mt-4 text-sm text-gray-500 dark:text-gray-400">
						Already working with Allen-Bailey? Your existing ordering process is still available.
					</P>
				</Div>
			</Div>
		</Container>
	</Section>
	<Section id="request-beta" variants={['surfaceAlternate']} aria-labelledby="request-beta-heading">
		<Container class="grid items-start gap-4 py-12 sm:py-16 lg:grid-cols-2">
			<Div class="lg:pr-12">
				<P variants={['eyebrow']}>Not invited yet?</P><H2
					id="request-beta-heading"
					class="text-3xl sm:text-4xl"
				>
					Request access to the beta.
				</H2><P class="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300">
					Tell us a little about your business and the products you order. Our team will review your
					request and follow up about availability.
				</P><P class="mt-6 text-gray-600 dark:text-gray-300">
					We're starting with fire suppression. You can also register interest in another market.
					Requesting an invitation does not create an account or grant shop access.
				</P>
			</Div>
			<Div
				class="rounded-sm bg-gray-50 p-6 inset-ring-1 inset-ring-gray-200 sm:p-8 dark:bg-gray-950 dark:inset-ring-gray-800"
			>
				{#if requestInvitation.result?.isSent}<P role="status">
						Your request has been sent to our team. We'll review it and contact you about the beta.
					</P>{/if}
				{#each requestInvitation.fields.allIssues() ?? [] as issue, index (index)}<P
						role="alert"
						class="mb-4 text-red-600 dark:text-red-300"
					>
						{issue.message}
					</P>{/each}
				<Form {...requestInvitation} aria-label="Request beta invitation" class="grid gap-4">
					<Div>
						<Label for="beta-name">Your name</Label><Input
							id="beta-name"
							{...requestInvitation.fields.name.as('text')}
							autocomplete="name"
							required
							maxlength={120}
							class="mt-2 w-full"
						/>
					</Div>
					<Div>
						<Label for="beta-company">Company</Label><Input
							id="beta-company"
							{...requestInvitation.fields.company.as('text')}
							autocomplete="organization"
							required
							maxlength={160}
							class="mt-2 w-full"
						/>
					</Div>
					<Div>
						<Label for="beta-email">Business email</Label><Input
							id="beta-email"
							{...requestInvitation.fields.email.as('email')}
							autocomplete="email"
							required
							maxlength={254}
							class="mt-2 w-full"
						/>
					</Div>
					<Div>
						<Label for="beta-market">Market of interest</Label><Select
							id="beta-market"
							{...requestInvitation.fields.market.as('select')}
							options={[{ label: 'Choose a market', value: '' }, ...betaMarkets]}
							required
							class="mt-2 w-full"
						/>
					</Div>
					<Div class="hidden" aria-hidden="true">
						<Label for="beta-website">Leave this field empty</Label><Input
							id="beta-website"
							{...requestInvitation.fields.website.as('text')}
							tabindex={-1}
							autocomplete="off"
						/>
					</Div>
					<Button
						type="submit"
						disabled={!data.isInvitationDeliveryConfigured || requestInvitation.pending > 0}
					>
						Request invitation
					</Button>
				</Form>
				{#if !data.isInvitationDeliveryConfigured}<P
						class="mt-4 text-sm text-gray-600 dark:text-gray-300"
					>
						Online requests are currently unavailable. Email our team to request an invitation.
					</P>{/if}
				<A
					href={`mailto:${contactDetails.email}?subject=Shop%20beta%20invitation%20request`}
					variants={['button.base', 'button.variant.neutral-outline']}
					class="mt-4"
				>
					<ActionLabel>Email our team</ActionLabel>
				</A>
			</Div>
		</Container>
	</Section>
</Main>
