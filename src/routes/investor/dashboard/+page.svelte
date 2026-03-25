<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import {
		ArrowRight,
		Briefcase,
		Calendar,
		DollarSign,
		LogOut,
		MessageCircle,
		TrendingUp,
		Mail
	} from 'lucide-svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	export let data;

	const iconComponents = {
		DollarSign,
		TrendingUp,
		Briefcase
	};

	const {
		investorName,
		kpiData,
		portfolioCompanies,
		featuredStartups,
		upcomingEvents,
		recentMessages,
		user
	} = data;

	async function handleLogout() {
		const response = await fetch('/api/auth/logout', {
			method: 'POST'
		});

		if (response.ok) {
			await goto('/auth/login');
		} else {
			console.error('Logout failed');
			alert('Logout failed. Please try again.');
		}
	}
</script>

<svelte:head>
	<title>Investor Dashboard - JEB Incubator</title>
	<meta
		name="description"
		content="Track your investment portfolio, discover new opportunities, and connect with innovative startups in the JEB Incubator ecosystem."
	/>
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<header class="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-sm">
		<div class="container mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<!-- 1. Côté Gauche : Logo (Structure identique au header principal) -->
				<div class="flex items-center space-x-2">
					<div
						class="relative flex h-12 w-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-800"
					>
						<a href="/" aria-label="Go to homepage"><img src="/logo.png" alt="Logo" /></a>
					</div>
					<div class="flex flex-col">
						<span class="font-playfair text-2xl leading-none font-bold text-stone-200">JEB</span>
						<span class="font-sans text-xs leading-none tracking-wider text-stone-300 uppercase">
							INCUBATOR
						</span>
					</div>
				</div>

				<!-- 2. Centre : Message de Bienvenue (Remplace la <nav>) -->
				<div class="hidden text-center md:block">
					<h1 class="font-playfair text-xl font-bold text-foreground">
						Welcome back, {investorName}!
					</h1>
					<p class="-mt-1 text-sm text-muted-foreground">Dashboard</p>
				</div>

				<!-- 3. Côté Droit : Boutons d'Action -->
				<div class="flex items-center gap-2">
					<Button href="/messages" class="bg-primary text-primary-foreground hover:bg-primary/90">
						<Mail class="mr-2 h-4 w-4" />
						Messages
					</Button>
					<Button
						onclick={handleLogout}
						variant="ghost"
						size="icon"
						aria-label="Log out"
						class="cursor-pointer"
					>
						<LogOut class="h-5 w-5" />
					</Button>
				</div>
			</div>
		</div>
	</header>
	<main class="container mx-auto px-4 py-12">
		<!-- Dashboard Header -->

		<!-- KPI Cards -->
		<section class="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each kpiData as kpi}
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">{kpi.title}</CardTitle>
						<svelte:component
							this={iconComponents[kpi.icon]}
							class="h-4 w-4 text-muted-foreground"
						/>
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">{kpi.value}</div>
						<p class="text-xs text-muted-foreground">{kpi.change}</p>
					</CardContent>
				</Card>
			{/each}
		</section>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left Column -->
			<div class="space-y-8 lg:col-span-2">
				<!-- My Investments Table -->
				<Card>
					<CardHeader>
						<CardTitle>My Investments</CardTitle>
						<CardDescription>An overview of your current portfolio companies.</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead class="w-[60px]"></TableHead>
									<TableHead>Company</TableHead>
									<TableHead>Sector</TableHead>
									<TableHead class="text-right">Amount Invested</TableHead>
									<TableHead class="text-right">Equity</TableHead>
									<TableHead>Last Update</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each portfolioCompanies as company}
									<TableRow>
										<TableCell>
											{#if company.image_path}
												<img
													src={company.image_path}
													alt={company.name}
													class="h-8 w-8 rounded-md object-cover"
												/>
											{:else}
												<div
													class="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-bold"
												>
													{company.name.charAt(0)}
												</div>
											{/if}
										</TableCell>
										<TableCell class="font-medium">{company.name}</TableCell>
										<TableCell><Badge variant="secondary">{company.sector}</Badge></TableCell>
										<TableCell class="text-right">{company.invested}</TableCell>
										<TableCell class="text-right">{company.equity}</TableCell>
										<TableCell>{company.lastUpdate}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<!-- Recommended Startups -->
				<Card>
					<CardHeader>
						<div class="flex items-center justify-between">
							<div>
								<CardTitle>Recommended For You</CardTitle>
								<CardDescription
									>Based on your investment focus, these startups might interest you.</CardDescription
								>
							</div>
							<Button href="/investor/startups" variant="outline">
								View All
								<ArrowRight class="ml-2 h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
						{#each featuredStartups as startup (startup.id)}
							<ProjectCard
								id={startup.id}
								name={startup.name}
								image={startup.image_path}
								sector={startup.sector}
								maturity={startup.maturity}
								description={startup.description}
								adress={startup.address}
								{user}
							/>
						{/each}
					</CardContent>
				</Card>
			</div>

			<!-- Right Column -->
			<div class="space-y-8">
				<!-- Recent Messages -->
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center">
							<MessageCircle class="mr-2 h-5 w-5" />
							Recent Messages
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul role="list" class="-my-3 divide-y divide-border">
							{#if recentMessages.length > 0}
								{#each recentMessages as msg}
									<li class="py-3">
										<a href="/messages?id={msg.id}" class="group block">
											<div class="flex items-center space-x-3">
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
											</div>
										</a>
									</li>
								{/each}
							{:else}
								<li class="py-4 text-center text-sm text-muted-foreground">No recent messages.</li>
							{/if}
						</ul>
					</CardContent>
				</Card>

				<!-- Upcoming Events -->
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center">
							<Calendar class="mr-2 h-5 w-5" />
							Upcoming Events
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						{#each upcomingEvents as event}
							<div class="flex items-start">
								<div
									class="mr-4 flex flex-col items-center justify-center rounded-md bg-card p-2 text-center text-sm"
								>
									<span class="font-bold text-primary uppercase">{event.date.split(' ')[0]}</span>
									<span class="text-lg font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
								</div>
								<div>
									<p class="font-semibold">{event.name}</p>
									<p class="text-sm text-muted-foreground">{event.location}</p>
								</div>
							</div>
						{/each}
					</CardContent>
				</Card>
			</div>
		</div>
	</main>
</div>
