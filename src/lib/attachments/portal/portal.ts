import { type Attachment } from 'svelte/attachments';

export const portal: Attachment = (element) => {
	if (typeof document === 'undefined') return;

	const previousParent = element.parentNode;
	const previousSibling = element.nextSibling;

	document.body.appendChild(element);

	return () => {
		if (!element.isConnected) return;

		if (!previousParent) {
			element.remove();
			return;
		}

		if (!previousSibling || previousSibling.parentElement !== previousParent) {
			previousParent.appendChild(element);
			return;
		}

		previousParent.insertBefore(element, previousSibling);
	};
};
