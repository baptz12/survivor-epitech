<!-- src/routes/startup/dashboard/+page.svelte -->
<script lang="ts">
	// Importations pour le contenu de la page
	import { ArrowUp, Briefcase, Eye, MessageCircle } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	// Import du nouveau composant Header pour le dashboard
	import DashboardHeader from '$lib/components/DashboardHeader.svelte';

	let { data } = $props();

	// On récupère les données de la page comme avant
	const {
		startup,
		profileCompletion,
		profileCompletionSuggestion,
		stats,
		viewHistory,
		recentMessages,
		opportunities
	} = data;

	// Mapping des icônes pour les cartes de statistiques (cette logique reste ici)
	const icons = {
		Eye,
		MessageCircle,
		Briefcase
	};

	// Calcul de la vue maximale pour le graphique
	const maxViews = Math.max(...viewHistory.map((v) => v.views), 0);
</script>

<svelte:head>
	<title>Startup Dashboard - JEB Incubator</title>
	<meta
		name="description"
		content="Manage your startup profile, track visibility metrics, connect with investors, and discover new opportunities in the JEB Incubator ecosystem."
	/>
</svelte:head>

<div class="min-h-screen w-full bg-background">
	<!-- On utilise le nouveau composant DashboardHeader en lui passant les données du startup -->
	<DashboardHeader {startup} />

	<!-- Le reste du contenu de la page est maintenant dans une balise <main> pour la sémantique -->
	<main class="p-4 sm:p-6 lg:p-8">
		<div class="mx-auto max-w-7xl">
			<!-- La grille principale de mise en page (votre contenu existant) -->
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
				<!-- Colonne 1 & 2: Contenu Principal -->
				<div class="grid auto-rows-max grid-cols-1 gap-6 lg:col-span-2 lg:gap-8">
					<!-- Cartes de Statistiques -->
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
						{#each stats as stat (stat.title)}
							{@const SvelteComponent = icons[stat.icon]}
							<div class="rounded-xl border border-border bg-card p-5">
								<div class="flex items-center justify-between">
									<h3 class="text-sm font-medium text-muted-foreground">
										{stat.title}
									</h3>
									<SvelteComponent class="h-5 w-5 {stat.color}" />
								</div>
								<div class="mt-4">
									<p class="text-3xl font-bold text-foreground">{stat.value}</p>
									<p class="mt-1 text-xs text-muted-foreground">{stat.change}</p>
								</div>
							</div>
						{/each}
					</div>

					<!-- Graphique de Visibilité -->
					<div class="rounded-xl border border-border bg-card p-5">
						<div class="mb-4 flex items-start justify-between">
							<div>
								<h3 class="font-playfair text-lg font-semibold text-foreground">
									Profile Visibility
								</h3>
								<p class="text-sm text-muted-foreground">Views over the last 7 days</p>
							</div>
							<div class="flex items-center text-sm text-primary">
								<ArrowUp class="h-4 w-4" />
								<span>+22% this week</span>
							</div>
						</div>
						<div class="h-60 w-full">
							<div class="flex h-full items-end justify-between gap-2">
								{#each viewHistory as item (item.day)}
									<div class="flex h-full flex-1 flex-col items-center justify-end gap-2">
										<div
											class="w-full rounded-t-lg bg-primary/80 transition-all duration-300 hover:bg-primary"
											style="height: {maxViews > 0 ? (item.views / maxViews) * 100 : 0}%"
											title="{item.views} views"
										></div>
										<span class="text-xs text-muted-foreground">{item.day}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

				<!-- Recent Messages -->
				<div class="rounded-xl border border-border bg-card p-5">
					<h3 class="font-playfair text-lg font-semibold text-foreground">Recent Messages</h3>
					<div class="mt-4 flow-root">
						<ul role="list" class="-my-5 divide-y divide-border">
							{#if recentMessages.length > 0}
								{#each recentMessages as msg (msg.id)}
									<li class="py-4">
										<a href="/messages?id={msg.id}" class="group block">
											<div class="flex items-center space-x-4">
												<div class="flex-shrink-0">
													{#if msg.image_path}
														<img
															src={msg.image_path}
															alt={msg.sender}
															class="h-8 w-8 rounded-full object-cover"
														/>
													{:else}
														<div
															class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground"
														>
															{msg.avatar}
														</div>
													{/if}
												</div>
												<div class="min-w-0 flex-1">
													<p
														class="truncate text-sm font-medium text-foreground group-hover:text-primary"
													>
														{msg.sender}
													</p>
													<p class="truncate text-sm text-muted-foreground">
														{msg.message}
													</p>
												</div>
												<div>
													<span class="inline-flex items-center text-xs text-muted-foreground">
														{msg.time}
													</span>
												</div>
											</div>
										</a>
									</li>
								{/each}
							{:else}
								<li class="py-4 text-center text-sm text-muted-foreground">No recent messages.</li>
							{/if}
						</ul>
					</div>
				</div>
			</div>

				<!-- Colonne 3: Contenu Latéral -->
				<div class="grid grid-cols-1 content-start gap-6 lg:gap-8">
					<!-- Complétion du Profil -->
					<div class="rounded-xl border border-border bg-card p-5">
						<h3 class="font-playfair text-lg font-semibold text-foreground">Profile Status</h3>
						<p class="mt-1 text-sm text-muted-foreground">
							A complete profile attracts more investors.
						</p>
						<div class="my-4 flex items-center gap-4">
							<div class="relative h-20 w-20">
								<svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
									<circle
										class="text-border"
										stroke-width="8"
										stroke="currentColor"
										fill="transparent"
										r="40"
										cx="50"
										cy="50"
									/>
									<circle
										class="text-primary"
										stroke-width="8"
										stroke-dasharray="251.2"
										stroke-dashoffset="calc(251.2 - (251.2 * {profileCompletion}) / 100))"
										stroke-linecap="round"
										stroke="currentColor"
										fill="transparent"
										r="40"
										cx="50"
										cy="50"
									/>
								</svg>
								<span
									class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-foreground"
								>
									{profileCompletion}%
								</span>
							</div>
							<div class="flex-1">
								<p class="font-semibold text-foreground">
									{#if profileCompletion < 100}Almost there!{:else}Excellent!{/if}
								</p>
								<p class="text-xs text-muted-foreground">
									{profileCompletionSuggestion}
								</p>
							</div>
						</div>
						<Button
							class="w-full bg-primary text-primary-foreground hover:bg-primary/90"
							href="/startup/edit"
						>
							Edit Profile
						</Button>
					</div>

					<!-- Opportunités -->
					<div class="rounded-xl border border-border bg-card p-5">
						<h3 class="font-playfair text-lg font-semibold text-foreground">Opportunities</h3>
						<ul class="mt-4 space-y-4">
							{#if opportunities.length > 0}
								{#each opportunities as op (op.title)}
									<li>
										<a href="#" class="group block">
											<div class="flex items-center justify-between">
												<p class="text-sm font-medium text-foreground group-hover:text-primary">
													{op.title}
												</p>
												<Badge class="{op.badgeColor} border-0">{op.type}</Badge>
											</div>
											<p class="mt-1 text-xs text-muted-foreground">
												{op.deadline}
											</p>
										</a>
									</li>
								{/each}
							{:else}
								<li class="text-center text-sm text-muted-foreground">
									No current opportunities.
								</li>
							{/if}
						</ul>
						<Button
							variant="outline"
							class="mt-4 w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
							href="/events"
							target="_blank"
						>
							View All
						</Button>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>