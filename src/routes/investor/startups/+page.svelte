<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Search, Filter, ArrowLeft } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	let { data } = $props();

	let projects = $state(data.projects || []);
	let sectors = $state(data.sectors || []);
	let maturities = $state(data.maturities || []);
	let user = $state(data.user);

	let searchTerm = $state('');
	let selectedSector = $state<string[]>([]);
	let selectedMaturity = $state<string[]>([]);

	let isMounted = false;
	onMount(() => (isMounted = true));

	async function fetchProjects() {
		if (!isMounted) return;

		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (selectedSector.length > 0) params.set('sector', selectedSector.join(','));
		if (selectedMaturity.length > 0) params.set('maturity', selectedMaturity.join(','));

		try {
			const response = await fetch(`/api/startups?${params.toString()}`);
			if (response.ok) {
				const result = await response.json();
				projects = result.data || [];
			}
		} catch (error) {
			console.error('Failed to fetch projects:', error);
		}
	}

	let debounceTimeout: number;

	$effect(() => {
		const _s = searchTerm;
		const _ss = selectedSector;
		const _sm = selectedMaturity;

		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(fetchProjects, 300);
	});
</script>

<svelte:head>
	<title>Browse Startups - Investor Dashboard</title>
	<meta name="description" content="Discover and connect with innovative startups." />
</svelte:head>

<div class="min-h-screen bg-background">
	<main class="container mx-auto px-4 py-8">
		<!-- Page Header -->
		<div class="mb-8">
			<Button variant="ghost" href="/investor/dashboard" class="mb-4 text-muted-foreground">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>
			<h1 class="font-playfair text-4xl font-bold text-foreground">Discover Startups</h1>
			<p class="mt-2 max-w-2xl text-lg text-muted-foreground">
				Browse the full portfolio of startups in the incubator and initiate conversations.
			</p>
		</div>

		<!-- Filters -->
		<div class="sticky top-0 z-10 mb-8 rounded-lg border bg-card/80 p-4 backdrop-blur-sm">
			<div class="flex flex-col items-center gap-4 md:flex-row">
				<div class="relative flex-1">
					<Search
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
					/>
					<Input
						placeholder="Search by name, sector, or keyword..."
						bind:value={searchTerm}
						class="pl-10"
					/>
				</div>
				<div class="flex gap-4">
					<Select bind:value={selectedSector}>
						<SelectTrigger class="w-40">
							<Filter class="mr-2 h-4 w-4" />
							Sector
						</SelectTrigger>
						<SelectContent>
							{#each sectors as sector}
								<SelectItem value={sector}>{sector === '' ? 'All sectors' : sector}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
					<Select bind:value={selectedMaturity}>
						<SelectTrigger class="w-40">Maturity</SelectTrigger>
						<SelectContent>
							{#each maturities as maturity}
								<SelectItem value={maturity}>
									{maturity === '' ? 'All maturities' : maturity}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>

		<!-- Projects Grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each projects as project}
				<ProjectCard
					image={project.image_path}
					name={project.name}
					sector={project.sector}
					maturity={project.maturity}
					description={project.description}
					id={project.id}
					adress={project.address}
					{user}
				/>
			{/each}
		</div>
		{#if projects.length === 0}
			<div class="py-16 text-center">
				<p class="text-lg text-muted-foreground">No projects found matching your criteria.</p>
				<Button
					variant="link"
					on:click={() => {
						searchTerm = '';
						selectedSector = [];
						selectedMaturity = [];
					}}
					class="mt-4 text-primary"
				>
					Clear filters
				</Button>
			</div>
		{/if}
	</main>
</div>
