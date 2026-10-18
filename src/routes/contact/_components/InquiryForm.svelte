<script lang="ts">
	// Imports
	import { A, Button, Div, Form, Input, Label, P, Span, Textarea } from '#lib/components';
	import { ArrowRight, CheckCircle2, LoaderCircle } from '#lib/icons';
	import { contactDetails } from '#lib/data/contact.js';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { fromAction } from 'svelte/attachments';
	import type { InquiryErrors, InquiryValues } from '../_lib/inquiry';
	import { tick } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	// Types
	type FormState = {
		errors?: InquiryErrors;
		isSent?: boolean;
		message?: string;
		values?: InquiryValues;
	} | null;

	// consts
	const controlId = $props.id();
	const fields = [
		{
			name: 'name',
			label: 'Your name',
			autocomplete: 'name',
			type: 'text',
			isRequired: true,
			maxlength: 120
		},
		{
			name: 'email',
			label: 'Email address',
			autocomplete: 'email',
			type: 'email',
			isRequired: true,
			maxlength: 254
		},
		{
			name: 'company',
			label: 'Company',
			autocomplete: 'organization',
			type: 'text',
			isRequired: false,
			maxlength: 160
		},
		{
			name: 'phone',
			label: 'Phone number',
			autocomplete: 'tel',
			type: 'tel',
			isRequired: false,
			maxlength: 40
		},
		{
			name: 'reference',
			label: 'Project or order reference',
			autocomplete: 'off',
			type: 'text',
			isRequired: false,
			maxlength: 100
		}
	] as const;

	// helpers
	const enhanceInquiry: SubmitFunction<
		Record<string, unknown> | undefined,
		Record<string, unknown> | undefined
	> = () => {
		clientMessage = '';
		isSubmitting = true;
		return async ({ result, update }) => {
			try {
				if (result.type === 'error') {
					clientMessage =
						'We could not connect to send your inquiry. Your details are still here. Please try again or email sales@abtl.com.';
				} else {
					await update({ reset: result.type === 'success' });
				}
				await tick();
				feedback?.focus();
			} finally {
				isSubmitting = false;
			}
		};
	};

	// $props()
	let { form, isDeliveryConfigured }: { form: FormState; isDeliveryConfigured: boolean } = $props();

	// $state
	let clientMessage = $state('');
	let feedback = $state<HTMLDivElement | null>(null);
	let isSubmitting = $state(false);

	// $derived
	const isFeedbackSent = $derived(Boolean(form?.isSent && !clientMessage));
</script>

<Form
	method="POST"
	action="/contact"
	{@attach fromAction(enhance, () => enhanceInquiry)}
	class="rounded-sm bg-gray-50 p-6 inset-ring-1 inset-ring-gray-200 sm:p-8 dark:bg-gray-950 dark:inset-ring-gray-800"
	aria-label="Contact inquiry"
	aria-busy={isSubmitting}
>
	{#if clientMessage || form?.message}<Div
			bind:element={feedback}
			tabindex={-1}
			role={isFeedbackSent ? 'status' : 'alert'}
			class={twMerge(
				'mb-6 rounded-sm p-4 inset-ring-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500',
				isFeedbackSent
					? 'bg-green-50 inset-ring-green-300 dark:bg-green-950 dark:inset-ring-green-800'
					: 'bg-red-50 inset-ring-red-300 dark:bg-red-950 dark:inset-ring-red-800'
			)}
			data-contact-feedback
		>
			{#if isFeedbackSent}<CheckCircle2 class="mb-2 size-5" aria-hidden="true" />{/if}<P>
				{clientMessage || form?.message}
			</P>
		</Div>{/if}
	<P class="mb-6 text-sm text-gray-600 dark:text-gray-300">
		Name, email, and message are required. Everything else helps us understand your project.
	</P>

	<Div class="grid gap-4 sm:grid-cols-2">
		{#each fields as field (field.name)}<Div
				class={field.name === 'reference' ? 'sm:col-span-2' : ''}
			>
				<Label for={`${controlId}-${field.name}`} class="mb-2 block text-sm font-medium">
					{field.label}{#if !field.isRequired}&nbsp;<Span
							class="font-normal text-gray-500 dark:text-gray-400"
						>
							(optional)
						</Span>{/if}
				</Label>
				<Input
					id={`${controlId}-${field.name}`}
					name={field.name}
					type={field.type}
					autocomplete={field.autocomplete}
					required={field.isRequired}
					maxlength={field.maxlength}
					value={form?.values?.[field.name] ?? ''}
					aria-invalid={form?.errors?.[field.name] ? 'true' : undefined}
					aria-describedby={form?.errors?.[field.name]
						? `${controlId}-${field.name}-error`
						: undefined}
					variants={form?.errors?.[field.name] ? ['error'] : []}
					class="w-full"
				/>
				{#if form?.errors?.[field.name]}<P
						id={`${controlId}-${field.name}-error`}
						class="mt-2 text-sm text-red-700 dark:text-red-300"
					>
						{form.errors[field.name]}
					</P>{/if}
			</Div>{/each}
		<Div class="sm:col-span-2">
			<Label for={`${controlId}-message`} class="mb-2 block text-sm font-medium">
				Your message
			</Label>
			<P id={`${controlId}-message-hint`} class="mb-3 text-sm text-gray-600 dark:text-gray-300">
				Tell us about your project or question. Size, quantity, application, and timing are helpful
				if you know them.
			</P>
			<Textarea
				id={`${controlId}-message`}
				name="message"
				required
				maxlength={5000}
				rows={6}
				value={form?.values?.message ?? ''}
				aria-invalid={form?.errors?.message ? 'true' : undefined}
				aria-describedby={`${controlId}-message-hint${form?.errors?.message ? ` ${controlId}-message-error` : ''}`}
				class={twMerge(
					'min-h-40 w-full rounded-sm',
					form?.errors?.message ? 'inset-ring-red-500' : ''
				)}
			/>
			{#if form?.errors?.message}<P
					id={`${controlId}-message-error`}
					class="mt-2 text-sm text-red-700 dark:text-red-300"
				>
					{form.errors.message}
				</P>{/if}
		</Div>
	</Div>
	<Div class="hidden" aria-hidden="true">
		<Label for={`${controlId}-website`}>Leave this field empty</Label><Input
			id={`${controlId}-website`}
			name="website"
			tabindex={-1}
			autocomplete="off"
		/>
	</Div>
	{#if !isDeliveryConfigured}<P
			class="mt-6 rounded-sm bg-amber-50 p-4 text-sm text-amber-950 inset-ring-1 inset-ring-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:inset-ring-amber-800"
			role="status"
		>
			Online sending is currently unavailable. Please email&nbsp;<A
				href={`mailto:${contactDetails.email}`}
				class="underline underline-offset-4"
			>
				{contactDetails.email}
			</A>&nbsp;or call our team.
		</P>{/if}
	<Div class="mt-6 flex flex-col items-start gap-4">
		<Button
			type="submit"
			disabled={isSubmitting || !isDeliveryConfigured}
			variants={['neutral']}
			class="w-full justify-center sm:w-auto"
		>
			{#if isSubmitting}<LoaderCircle
					class="size-4 motion-safe:animate-spin"
					aria-hidden="true"
				/>Sending inquiry{:else}Send inquiry<ArrowRight class="size-4" aria-hidden="true" />{/if}
		</Button>
		<P class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
			Your details are used to respond to this inquiry. Need to share artwork or a photo? Email
			supporting files to&nbsp;<A
				href={`mailto:${contactDetails.email}`}
				class="underline underline-offset-4"
			>
				{contactDetails.email}
			</A>.
		</P>
	</Div>
</Form>
