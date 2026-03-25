// src/routes/admin/news/+page.server.ts
import type { PageServerLoad } from './$types';

// Fake news data, just like your fakeUsers and fakeStartups arrays.
const fakeNews = [
	{
		id: 1,
		title: 'QuantumLeap AI Secures $5M Seed Funding',
		category: 'Funding',
		news_date: '2025-08-15',
		imageUrl: '/team/Gabriel.png' // Example placeholder image
	},
	{
		id: 2,
		title: 'BioSynth Solutions Launches New Sustainable Material',
		category: 'Launch',
		news_date: '2025-07-22',
		imageUrl: '/team/Cabrera.png' // Example placeholder image
	},
	{
		id: 3,
		title: 'Helios Energy Wins CleanTech Innovation Award',
		category: 'Award',
		news_date: '2025-06-30',
		imageUrl: '/team/Antoine.png' // Example placeholder image
	}
];

export const load: PageServerLoad = async () => {
	// The page will load and display the news from the array above.
	return {
		news: fakeNews
	};
};