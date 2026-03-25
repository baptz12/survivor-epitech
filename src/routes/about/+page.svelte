<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogFooter
	} from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import {
		Building,
		Target,
		Users,
		Globe,
		HeartHandshake,
		X,
		Lightbulb,
		Mail,
		MapPin,
		Handshake
	} from 'lucide-svelte';

	// Données statiques
	const teamMembers = [
		{
			name: 'Gabriel THUUS',
			role: 'Backend developer',
			imageUrl: '/team/Gabriel.png', // Placeholder path
			bio: 'Visionary leader with a passion for disruptive technology and fostering innovation.'
		},
		{
			name: 'Baptiste Zetler',
			role: 'Frontend developer',
			imageUrl: '/team/Baptiste.png',// Placeholder path
			bio: 'Experienced entrepreneur with a knack for scaling startups from seed to series A.'
		},
		{
			name: 'Mateo Cabrera',
			role: 'FullStack Developer',
			imageUrl: '/team/Cabrera.png', // Placeholder path
			bio: 'A full-stack architect dedicated to building robust and scalable tech solutions.'
		},
		{
			name: 'Antoine Colin',
			role: 'Manager',
			imageUrl: '/team/Antoine.png', // Placeholder path
			bio: 'Expert in optimizing processes and ensuring the smooth operation of our ecosystem.'
		}
	];

	const corePrinciples = [
		{
			icon: Target,
			title: 'Our Mission',
			text: 'To provide startups with the essential resources, strategic guidance, and powerful network they need to navigate the challenges of growth and achieve market leadership.'
		},
		{
			icon: Globe,
			title: 'Our Vision',
			text: 'To be the leading launchpad for transformative technology startups across the globe, fostering a future where bold ideas, driven by passionate founders, create a lasting impact.'
		},
		{
			icon: Users,
			title: 'Collaborative Ecosystem',
			text: 'We are committed to building a collaborative ecosystem where innovation thrives. We believe the best ideas are born from shared knowledge and mutual support.'
		},
		{
			icon: Lightbulb,
			title: 'Fostering Innovation',
			text: 'At our core, we are driven to foster a culture of relentless innovation, empowering founders to challenge the status quo and build groundbreaking solutions.'
		}
	];

	let { data } = $props();
	const partners = data.partners;

	let isModalOpen = $state(false);
	let selectedPartner = $state(null);

	function openModal(partner) {
		selectedPartner = partner;
		isModalOpen = true;
	}

	// 1. Déclarer une variable pour contenir la référence à l'élément HTML
	let carouselElement: HTMLDivElement;

	$effect(() => {
		if (carouselElement) {
			// Si la modale est ouverte, on met l'animation en pause via JS
			if (isModalOpen) {
				carouselElement.style.animationPlayState = 'paused';
			}
			// Sinon, on retire le style en ligne pour que les règles CSS (hover) puissent s'appliquer
			else {
				carouselElement.style.animationPlayState = '';
			}
		}
	});

</script>

<div class="min-h-screen bg-background">
	<Header />

	<!-- Hero Section -->
	<section class="border-b border-border bg-gradient-to-br from-background to-card/30 py-24">
		<div class="container mx-auto px-4 text-center">
			<h1 class="mb-4 font-playfair text-5xl font-bold text-foreground md:text-6xl">
				Fueling the Next Generation of Innovators
			</h1>
			<p class="mx-auto max-w-3xl text-xl text-muted-foreground">
				We are a dedicated team of entrepreneurs, mentors, and investors committed to helping
				early-stage startups transform their visions into reality.
			</p>
		</div>
	</section>

	<!-- What Drives Us (Carousel) -->
	<section class="py-20">
		<div class="container mx-auto">
			<div class="mb-12 px-4 text-center">
				<h2 class="mb-4 font-playfair text-4xl font-bold text-foreground">What Drives Us</h2>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					Our principles are the foundation of our commitment to your success.
				</p>
			</div>
			<div class="relative">
				<div
					class="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-16 bg-gradient-to-r from-background to-transparent sm:block"
				/>
				<div
					class="scrollbar-hide flex snap-x snap-mandatory gap-8 overflow-x-auto px-4 pb-4 sm:px-16"
				>
					{#each corePrinciples as principle}
						<div class="w-4/5 flex-shrink-0 snap-center sm:w-1/2 md:w-2/5 lg:w-1/3">
							<div
								class="flex h-full flex-col rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg"
							>
								<div
									class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary"
								>
									<svelte:component this={principle.icon} class="h-6 w-6" />
								</div>
								<h3 class="mb-4 font-playfair text-3xl font-bold text-foreground">
									{principle.title}
								</h3>
								<p class="text-muted-foreground">{principle.text}</p>
							</div>
						</div>
					{/each}
				</div>
				<div
					class="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-16 bg-gradient-to-l from-background to-transparent sm:block"
				/>
			</div>
		</div>
	</section>

	<!-- "Meet the Team" Section -->
	<section class="border-t border-border bg-card/50 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 font-playfair text-4xl font-bold text-foreground">Meet Our Core Team</h2>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					The passionate individuals dedicated to your success.
				</p>
			</div>
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				{#each teamMembers as member}
					<div
						class="flex flex-col items-center rounded-lg border border-border bg-background p-6 text-center shadow-sm transition-transform hover:-translate-y-1"
					>
						<img
							src={member.imageUrl}
							alt={member.name}
							class="mb-4 h-32 w-32 rounded-full border-2 border-primary object-cover"
						/>
						<h3 class="mb-2 text-2xl font-bold text-foreground">{member.name}</h3>
						<Badge variant="secondary" class="mb-4">{member.role}</Badge>
						<p class="text-sm text-muted-foreground">{member.bio}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Our Partners Section -->
	<section class="border-t border-border py-20">
		<div class="container mx-auto">
			<div class="mb-12 px-4 text-center">
				<div
					class="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary"
				>
					<HeartHandshake class="h-6 w-6" />
				</div>
				<h2 class="mb-4 font-playfair text-4xl font-bold text-foreground">Our Trusted Partners</h2>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					We collaborate with industry leaders to provide our startups with the best opportunities.
				</p>
			</div>
			<div
				class="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]"
			>
				<!-- 3. Lier notre variable à l'élément avec bind:this -->
				<div
					class="animate-scroll flex w-max items-center gap-8"
					aria-hidden="true"
					bind:this={carouselElement}
				>
					{#if partners}
						{#each [...partners, ...partners] as partner}
							<div
								class="flex-shrink-0 cursor-pointer"
								on:click={() => openModal(partner)}
								role="button"
								tabindex="0"
								on:keydown={(e) => e.key === 'Enter' && openModal(partner)}
							>
								<Badge
									variant="outline"
									class="px-6 py-3 text-lg font-semibold transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
								>
									{partner.name}
								</Badge>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</section>

	<Footer />
</div>

<Dialog bind:open={isModalOpen}>
	<DialogContent class="sm:max-w-[425px]">
		{#if selectedPartner}
			<DialogHeader>
				<DialogTitle class="text-2xl">{selectedPartner.name}</DialogTitle>
				<DialogDescription>
					{selectedPartner.description || 'No description available.'}
				</DialogDescription>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<div class="flex items-center gap-4">
					<Handshake class="h-4 w-4 text-muted-foreground" />
					<span class="text-sm">
						<strong class="font-semibold">Partnership:</strong>
						{selectedPartner.partnership_type || 'N/A'}
					</span>
				</div>
				<div class="flex items-center gap-4">
					<Mail class="h-4 w-4 text-muted-foreground" />
					<a href="mailto:{selectedPartner.email}" class="text-sm hover:underline">
						{selectedPartner.email}
					</a>
				</div>
				{#if selectedPartner.address}
					<div class="flex items-start gap-4">
						<MapPin class="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
						<span class="text-sm">{selectedPartner.address}</span>
					</div>
				{/if}
			</div>
		{/if}
	</DialogContent>
</Dialog>

<style>
	@keyframes scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	.animate-scroll {
		animation: scroll 50s linear infinite;
		/* On s'assure que l'état par défaut est 'running' */
		animation-play-state: running;
	}
	
	.group:hover .animate-scroll,
	.animate-scroll:hover {
	  animation-play-state: paused;
	}
	/* La règle CSS pour la pause au survol reste la même */


	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>