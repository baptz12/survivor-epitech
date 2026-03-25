// src/routes/admin/startups/+page.server.ts
import type { PageServerLoad } from './$types';

// Fake startup data, similar to your fakeUsers array.
const fakeStartups = [
	{
		id: 1,
		name: 'QuantumLeap AI',
		sector: 'Artificial Intelligence',
		maturity: 'Seed Stage',
		imageUrl: '/team/Gabriel.png' // Example placeholder image
	},
	{
		id: 2,
		name: 'BioSynth Solutions',
		sector: 'Biotechnology',
		maturity: 'Series A',
		imageUrl: '/team/Cabrera.png' // Example placeholder image
	},
	{
		id: 3,
		name: 'Helios Energy',
		sector: 'Renewable Energy',
		maturity: 'Growth Stage',
		imageUrl: '/team/Antoine.png' // Example placeholder image
	}
];

export const load: PageServerLoad = async () => {
	// The page will load and display the startups from the array above.
	return {
		startups: fakeStartups
	};
};