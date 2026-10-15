export const attachmentOptions = [
	{
		id: 'patch',
		name: 'Patch',
		variants: [],
		category: 'Reinforce the hole',
		title: 'A small detail at the point of connection.',
		description:
			'A patch adds reinforcement around the tag hole. Consider this detail alongside the stock and the attachment, so the connection is part of the design from the start.',
		question: 'How will the tag be handled once it is attached?',
		brief: 'Tell us your tag stock, attachment choice, and how often the tag will be handled.'
	},
	{
		id: 'eyelets',
		name: 'Eyelets',
		variants: ['3/16" brass', '3/8" brass', '3/16" zinc', '1/4" zinc'],
		category: 'Reinforce the hole',
		title: 'Give the opening a considered finish.',
		description:
			'An eyelet lines the tag hole with a metal fitting. Bring the stock, fastening method, and intended use into the conversation to explore the right combination.',
		question: 'What will pass through the tag hole?',
		brief: 'Share your attachment method and the size and handling requirements of your tag.'
	},
	{
		id: 'wire',
		name: 'Wire',
		variants: ['21 gauge steel', '23 gauge steel', '25 gauge steel', '21 gauge copper'],
		category: 'Make the connection',
		title: 'Keep identification with the work.',
		description:
			'Wire provides a fastening option for tags used on equipment, materials, and other items. Start with the attachment point and the conditions the tag will encounter.',
		question: 'Where will the wire be fastened?',
		brief:
			'Describe the item, attachment point, exposure, and how the tag will be fitted or removed.'
	},
	{
		id: 'string',
		name: 'String',
		variants: ['#5 white', '#9 white', '#9 twine'],
		category: 'Make the connection',
		title: 'Tie the finishing detail together.',
		description:
			'String offers a familiar tied connection between a tag and its item. Consider how the tag will be presented, handled, and removed as you plan the finished piece.',
		question: 'How should the tag hang?',
		brief:
			'Tell us about the item, the hanging length you have in mind, and how the tag will be tied.'
	},
	{
		id: 'elastic',
		name: 'Elastic',
		variants: ['White', 'Black'],
		category: 'Make the connection',
		title: 'Make room for a flexible fit.',
		description:
			'An elastic loop offers another way to fit a tag around an item. The shape of the item and the way the tag will be applied help guide the discussion.',
		question: 'What does the loop need to fit around?',
		brief: 'Share the item dimensions, application method, and the fit you need.'
	}
] as const;

export type AttachmentKind = (typeof attachmentOptions)[number]['id'];
export type AttachmentOption = (typeof attachmentOptions)[number];
