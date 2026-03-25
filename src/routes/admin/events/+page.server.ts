// src/routes/admin/events/+page.server.ts
import type { PageServerLoad } from './$types';

// Fake event data, following the established pattern.
const fakeEvents = [
	{
		id: 1,
		title: 'Annual Investor Pitch Day',
		category: 'Pitch Session',
		event_date: '2025-10-25T10:00:00',
		imageUrl: '/team/Gabriel.png' // Example placeholder image
	},
	{
		id: 2,
		title: 'Workshop: Scaling Your SaaS Business',
		category: 'Workshop',
		event_date: '2025-11-12T14:00:00',
		imageUrl: '/team/Cabrera.png' // Example placeholder image
	},
	{
		id: 3,
		title: 'Innovator Networking Night',
		category: 'Networking',
		event_date: '2025-11-30T18:30:00',
		imageUrl: '/team/Antoine.png' // Example placeholder image
	}
];

export const load: PageServerLoad = async () => {
	// The page will load and display the events from the array above.
	return {
		events: fakeEvents
	};
};