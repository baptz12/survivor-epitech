<!-- src/routes/admin/startups/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Plus } from 'lucide-svelte';

	// This line is important for Svelte 5. If you are not using Svelte 5,
	// change `let { data } = $props();` to `export let data;`
	let { data } = $props();

	// Styles for the different maturity stages, just like you had for roles
	const maturityStyles: Record<string, string> = {
		'Seed Stage': 'bg-accent/20 text-accent border-accent/50',
		'Series A': 'bg-chart-4/20 text-chart-4 border-chart-4/50',
		'Growth Stage': 'bg-primary/20 text-primary border-primary/50',
		Idea: 'bg-muted/20 text-muted-foreground border-muted/50'
	};
</script>

<div class="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8">
			<Button variant="ghost" href="/startup/dashboard" class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>
			<div class="flex items-center justify-between">
				<div>
					<h1 class="font-playfair text-3xl font-bold text-foreground md:text-4xl">
						Startup Management
					</h1>
					<p class="mt-1 text-muted-foreground">Add, edit, or remove startup profiles.</p>
				</div>
				<Button href="/admin/startups/create">
					<Plus class="mr-2 h-4 w-4" />
					Add New Startup
				</Button>
			</div>
		</header>

		<div class="space-y-4">
			{#each data.startups as startup (startup.id)}
				<div
					class="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary"
						>
							{#if startup.imageUrl}
								<img src={startup.imageUrl} alt={startup.name} class="h-full w-full object-cover" />
							{:else}
								<span class="text-xl font-bold text-secondary-foreground">
									{startup.name.charAt(0)}
								</span>
							{/if}
						</div>
						<div>
							<p class="font-bold text-foreground">{startup.name}</p>
							<p class="text-sm text-muted-foreground">{startup.sector}</p>
						</div>
					</div>

					<div class="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-4">
						<span
							class="rounded-full border px-3 py-1 text-xs font-semibold {maturityStyles[
								startup.maturity
							] ?? maturityStyles['Idea']}"
						>
							{startup.maturity}
						</span>
						<!-- This button correctly links to the edit page for each specific startup -->
						<Button href={`/admin/startups/${startup.id}/edit`} variant="outline" size="sm">
							Manage Startup
						</Button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>