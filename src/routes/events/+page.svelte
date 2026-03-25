<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		ChevronLeft,
		ChevronRight,
		MapPin,
		ArrowLeft,
		X,
		Calendar as CalendarIcon
	} from 'lucide-svelte';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogClose
	} from '$lib/components/ui/dialog';

	let { data } = $props<{ data: { events: any[] } }>();
	const events = data?.events ?? [];

	// --- GESTION DE L'ÉTAT POUR LA MODALE ---
	let isModalOpen = $state(false);
	let selectedEvent = $state<any | null>(null);

	// Fonction pour ouvrir la modale avec les données de l'événement cliqué
	const openEventModal = (event: any) => {
		selectedEvent = event;
		isModalOpen = true;
	};

	let currentDate = new Date();
	let year = $state(currentDate.getFullYear());
	let month = $state(currentDate.getMonth());

	const getCalendarDays = (year: number, month: number) => {
		const date = new Date(year, month, 1);
		const days = [];
		const firstDayOfWeek = date.getDay();
		for (let i = 0; i < firstDayOfWeek; i++) {
			days.push(null);
		}
		while (date.getMonth() === month) {
			days.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		return days;
	};

	let calendarDays = $derived(getCalendarDays(year, month));
	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const goToPreviousMonth = () => {
		if (month === 0) {
			month = 11;
			year--;
		} else {
			month--;
		}
	};

	const goToNextMonth = () => {
		if (month === 11) {
			month = 0;
			year++;
		} else {
			month++;
		}
	};

	const monthName = $derived(new Date(year, month).toLocaleString('fr-FR', { month: 'long' }));

	const groupEventsByDate = (events: any[]) => {
		const map = new Map();
		if (!events) return map;
		events.forEach((event) => {
			const eventDate = new Date(event.dates).toDateString();
			if (!map.has(eventDate)) {
				map.set(eventDate, []);
			}
			map.get(eventDate).push(event);
		});
		return map;
	};
	const eventsByDate = $derived(groupEventsByDate(events));

	const mapEventTypeToBadge = (eventType: string) => {
		switch (eventType) {
			case 'Pitch Session':
				return 'bg-blue-500/20 text-blue-300';
			case 'Conference':
				return 'bg-purple-500/20 text-purple-300';
			case 'Workshop':
				return 'bg-yellow-500/20 text-yellow-300';
			default:
				return 'bg-stone-500/20 text-stone-300';
		}
	};
</script>

<div class="min-h-screen bg-background">
	<Header />
	<main class="container mx-auto max-w-5xl flex-grow px-4 py-12 sm:py-16">
		<!-- En-tête de la page -->
		<header class="mb-12 text-center">
			<h1 class="font-playfair text-4xl font-bold text-foreground md:text-5xl">Upcoming Events</h1>
			<p class="mt-2 text-lg text-muted-foreground">
				Join us for our next series of workshops, pitches, and networking nights.
			</p>
		</header>

		<!-- Calendrier -->
		<div class="rounded-xl border border-border bg-card/50 p-6">
			<!-- Contrôles du calendrier -->
			<div class="mb-6 flex items-center justify-between">
				<h2 class="font-playfair text-2xl font-bold text-foreground capitalize">
					{monthName}
					{year}
				</h2>
				<div class="flex items-center gap-2">
					<Button onclick={goToPreviousMonth} variant="outline" size="icon">
						<ChevronLeft class="h-4 w-4" />
					</Button>
					<Button onclick={goToNextMonth} variant="outline" size="icon">
						<ChevronRight class="h-4 w-4" />
					</Button>
				</div>
			</div>

			<!-- Grille du calendrier -->
			<div class="grid grid-cols-7 gap-1">
				<!-- Jours de la semaine -->
				{#each weekDays as day}
					<div
						class="text-center font-sans text-sm font-bold tracking-wider text-stone-400 uppercase"
					>
						{day}
					</div>
				{/each}

				<!-- Jours du mois -->
				{#each calendarDays as day}
					<div
						class="relative min-h-[150px] rounded-lg border border-transparent bg-slate-800/50 p-2 {day
							? 'hover:border-slate-700'
							: ''}"
					>
						{#if day}
							<span class="font-sans text-lg font-bold text-stone-200">
								{day.getDate()}
							</span>

							<!-- Événements du jour -->
							{#if eventsByDate.has(day.toDateString())}
								<div class="mt-1 space-y-1 overflow-y-auto" style="max-height: 110px;">
									{#each eventsByDate.get(day.toDateString()) as event}
										<!-- --- MODIFICATION : Ajout de l'événement onclick --- -->
										<div
											class="cursor-pointer rounded p-1 text-left text-xs {mapEventTypeToBadge(
												event.event_type
											)}"
											onclick={() => openEventModal(event)}
											onkeydown={() => openEventModal(event)}
											role="button"
											tabindex="0"
										>
											<p class="font-bold">{event.name}</p>
											<div class="flex items-center text-xs opacity-80">
												<MapPin class="mr-1 h-3 w-3" />
												{event.location}
											</div>
										</div>
									{/each}
								</div>
							{/if}
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</main>
	<Footer />
</div>

<Dialog bind:open={isModalOpen}>
	<!--
        MODIFICATION 1:
        - sm:max-w-lg est retiré
        - w-fit est ajouté pour que la largeur s'adapte au contenu.
        - max-w-[calc(100vw-2rem)] empêche la modale de déborder de l'écran.
        - max-h-[calc(100vh-2rem)] et overflow-y-auto permettent le défilement si le contenu est trop haut.
    -->
	<DialogContent
		class="max-h-[calc(100vh-2rem)] w-fit max-w-[calc(100vw-2rem)] overflow-y-auto border-border bg-card p-0 text-stone-200 [&>button]:hidden"
	>
		{#if selectedEvent}
			<div class="relative">
				<DialogClose
					class="absolute top-3 right-3 z-10 rounded-full bg-black/30 p-1.5 text-stone-300 transition-colors hover:bg-black/50 hover:text-white focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
				>
					<X class="h-5 w-5" style="filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.5));" />
					<span class="sr-only">Close</span>
				</DialogClose>

				<!-- Image de l'événement -->
				{#if selectedEvent.image_path}
					<!--
                        MODIFICATION 2:
                        - Le conteneur <div> n'a plus de classes de dimensionnement.
                        - L'image <img> n'est plus étirée et utilise ses dimensions naturelles.
                    -->
					<div class="overflow-hidden rounded-t-lg">
						<img
							src={selectedEvent.image_path}
							alt="Illustration pour {selectedEvent.name}"
							class="block max-w-full"
						/>
					</div>
				{/if}

				<!-- Contenu textuel de l'événement (inchangé) -->
				<div class="p-6">
					<DialogHeader class="text-left">
						<DialogTitle
							class="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2 font-playfair text-2xl text-foreground"
						>
							{selectedEvent.name}
							<Badge class="{mapEventTypeToBadge(selectedEvent.event_type)} border-0 text-sm">
								{selectedEvent.event_type}
							</Badge>
						</DialogTitle>
						<div class="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:gap-4">
							<div class="flex items-center text-muted-foreground">
								<CalendarIcon class="mr-2 h-4 w-4" />
								<span class="font-sans text-sm">
									{new Date(selectedEvent.dates).toLocaleString('en-US', {
										dateStyle: 'full',
										timeStyle: 'short'
									})}
								</span>
							</div>
							<div class="flex items-center text-muted-foreground">
								<MapPin class="mr-2 h-4 w-4" />
								<span class="font-sans text-sm">{selectedEvent.location}</span>
							</div>
						</div>
					</DialogHeader>
					<div class="py-4">
						<DialogDescription class="font-sans text-base text-muted-foreground">
							{selectedEvent.description}
						</DialogDescription>
					</div>
				</div>
			</div>
		{/if}
	</DialogContent>
</Dialog>
