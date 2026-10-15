export const attachmentOptions = [
	{
		id: 'patch',
		name: 'Patch',
		variants: [],
		category: 'Reinforce the hole',
		title: 'A small detail at the point of connection.',
		description:
			'The tag hole is where the pull of an attachment meets the stock. A patch reinforces the area around that opening, spreading the pull across a larger surface to help reduce tearing at the connection.',
		guidance:
			'Consider the tag stock, the fastening method, and how often the tag will be handled. Reinforcement and attachment should be planned together.',
		question: 'How will the tag be handled once it is attached?'
	},
	{
		id: 'eyelets',
		name: 'Eyelets',
		variants: ['3/16" brass', '3/8" brass', '3/16" zinc', '1/4" zinc'],
		category: 'Reinforce the hole',
		title: 'Give the opening a considered finish.',
		description:
			'An eyelet forms a metal-lined opening through the tag, helping protect the edge where a wire, string, or other fastening passes through. Choose the size and metal alongside the stock and the attachment.',
		guidance:
			'Start with what needs to pass through the opening and the handling the tag will encounter. Compare the brass and zinc options shown here, then discuss the complete tag before choosing.',
		question: 'What will pass through the tag hole?'
	},
	{
		id: 'wire',
		name: 'Wire',
		variants: ['21 gauge steel', '23 gauge steel', '25 gauge steel', '21 gauge copper'],
		category: 'Make the connection',
		title: 'Keep identification with the work.',
		description:
			'Wire can be wrapped around an attachment point and twisted to fasten a tag to equipment, materials, or other items. The wire material and gauge affect how the connection feels and handles during fitting.',
		guidance:
			'A higher gauge number means thinner wire. Of our steel options, 21 gauge is the thickest and 25 gauge the thinnest. Consider flexibility, the attachment point, and the length needed to reach around it; 21 gauge copper is also available.',
		question: 'How much wire does the connection need?'
	},
	{
		id: 'string',
		name: 'String',
		variants: ['#5 white', '#9 white', '#9 twine'],
		category: 'Make the connection',
		title: 'Tie the finishing detail together.',
		description:
			'String gives a tag a tied connection and room to hang. The choice affects the presentation of the finished tag as well as how it will be fitted and removed. Choose from #5 white, #9 white, or #9 twine.',
		guidance:
			'Think about the distance from the attachment point to the tag, the room needed to tie it, and clearance for the tag to hang without catching on nearby items. Share how you intend to attach it so we can discuss the finished arrangement.',
		question: 'How should the tag hang?'
	},
	{
		id: 'elastic',
		name: 'Elastic',
		variants: ['White', 'Black'],
		category: 'Make the connection',
		title: 'Make room for a flexible fit.',
		description:
			'Elastic stretches to fit around an item and draws back toward its resting shape. It offers a flexible loop connection where the tag needs to slip over a product or attachment point. White and black options let you consider the connection as part of the finished presentation.',
		guidance:
			'Share both the size the loop must pass over and the point where it will rest. Those can be different dimensions; both matter when discussing the fit.',
		question: 'What does the loop need to fit around?'
	}
] as const;

export type AttachmentKind = (typeof attachmentOptions)[number]['id'];
export type AttachmentOption = (typeof attachmentOptions)[number];
