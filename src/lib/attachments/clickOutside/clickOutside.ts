import type { Attachment } from 'svelte/attachments';

export const clickOutside = (onclick: () => Promise<any>): Attachment => {
	let clickElement: Element;
	const documentClickHandler = async (event: Event) => {
		const targetElement = event.target as Node;
		if (targetElement === null) return;
		if (!clickElement.contains(targetElement) && targetElement !== clickElement) {
			await onclick();
		}
	};
	document.addEventListener('click', documentClickHandler);
	return (element: Element) => {
		clickElement = element;
	};
};
