import type { Attachment } from 'svelte/attachments';

type DismissOutsideOptions = {
	contentSelector: string;
	onDismiss: () => void;
};

/** Dismiss only when a pointer gesture starts and ends outside the dialog content. */
export const dismissOutside =
	({ contentSelector, onDismiss }: DismissOutsideOptions): Attachment<HTMLElement> =>
	(element) => {
		let isPointerDownOutside = false;
		const isOutside = (target: EventTarget | null) =>
			target instanceof Element && !target.closest(contentSelector);
		const onClick = (event: MouseEvent) => {
			const isDismissal = isPointerDownOutside && isOutside(event.target);
			isPointerDownOutside = false;
			if (!isDismissal) return;
			event.stopPropagation();
			onDismiss();
		};
		const onPointerCancel = () => {
			isPointerDownOutside = false;
		};
		const onPointerDown = (event: PointerEvent) => {
			isPointerDownOutside = event.isPrimary && event.button === 0 && isOutside(event.target);
		};
		element.addEventListener('click', onClick);
		element.addEventListener('pointercancel', onPointerCancel);
		element.addEventListener('pointerdown', onPointerDown);
		return () => {
			element.removeEventListener('click', onClick);
			element.removeEventListener('pointercancel', onPointerCancel);
			element.removeEventListener('pointerdown', onPointerDown);
		};
	};
