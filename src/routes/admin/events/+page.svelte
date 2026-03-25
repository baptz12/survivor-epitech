<!-- src/routes/admin/events/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Plus } from 'lucide-svelte';

	// Svelte 5 syntax. For older versions, use `export let data;`
	let { data } = $props();

	// Styles for event categories
	const categoryStyles: Record<string, string> = {
		'Pitch Session': 'bg-primary/20 text-primary border-primary/50',
		Workshop: 'bg-accent/20 text-accent border-accent/50',
		Conference: 'bg-chart-5/20 text-chart-5 border-chart-5/50',
		Networking: 'bg-chart-4/20 text-chart-4 border-chart-4/50'
	};

	// Helper function to format the date and time string
	function formatDateTime(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}
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
						Event Management
					</h1>
					<p class="mt-1 text-muted-foreground">Add, edit, or remove incubator events.</p>
				</div>
				<Button href="/admin/events/create">
					<Plus class="mr-2 h-4 w-4" />
					Add New Event
				</Button>
			</div>
		</header>

		<div class="space-y-4">
			{#each data.events as event (event.id)}
				<div
					class="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary"
						>
							{#if event.imageUrl}
								<img src={event.imageUrl} alt={event.title} class="h-full w-full object-cover" />
							{:else}
								<!-- Fallback icon for events -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="h-6 w-6 text-muted-foreground"
								>
									<path d="M8 2v4" />
									<path d="M16 2v4" />
									<rect width="18" height="18" x="3" y="4" rx="2" />
									<path d="M3 10h18" />
								</svg>
							{/if}
						</div>
						<div>
							<p class="font-bold text-foreground">{event.title}</p>
							<p class="text-sm text-muted-foreground">{formatDateTime(event.event_date)}</p>
						</div>
					</div>

					<div class="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-4">
						<span
							class="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold {categoryStyles[
								event.category
							] ?? 'bg-muted/20 text-muted-foreground border-muted/50'}"
						>
							{event.category}
						</span>
						<!-- This button correctly links to the edit page for each specific event -->
						<Button href={`/admin/events/${event.id}/edit`} variant="outline" size="sm">
							Manage Event
						</Button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>