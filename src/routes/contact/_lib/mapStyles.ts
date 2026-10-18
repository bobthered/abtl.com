export type MapPalette = {
	background: string;
	foreground: string;
	park: string;
	primary: string;
	road: string;
	secondary: string;
	water: string;
};

/** Read the site's computed Tailwind colors before passing Google's required hex colors. */
export const mapColorToHex = (color: string) => {
	const context = new OffscreenCanvas(1, 1).getContext('2d')!;
	context.fillStyle = color;
	context.fillRect(0, 0, 1, 1);
	return `#${[...context.getImageData(0, 0, 1, 1).data]
		.slice(0, 3)
		.map((channel) => channel.toString(16).padStart(2, '0'))
		.join('')}`;
};

export const createMapStyles = (palette: MapPalette): google.maps.MapTypeStyle[] => [
	{ elementType: 'geometry', stylers: [{ color: palette.background }] },
	{ elementType: 'labels.text.fill', stylers: [{ color: palette.foreground }] },
	{ elementType: 'labels.text.stroke', stylers: [{ color: palette.background }] },
	{ featureType: 'poi', stylers: [{ visibility: 'off' }] },
	{ featureType: 'transit', stylers: [{ visibility: 'off' }] },
	{ featureType: 'road', elementType: 'geometry', stylers: [{ color: palette.road }] },
	{
		featureType: 'road.arterial',
		elementType: 'geometry.stroke',
		stylers: [{ color: palette.primary }]
	},
	{ featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: palette.secondary }] },
	{ featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: palette.park }] },
	{ featureType: 'water', elementType: 'geometry', stylers: [{ color: palette.water }] }
];
