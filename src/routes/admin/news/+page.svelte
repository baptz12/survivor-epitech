<!-- src/routes/admin/news/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Plus } from 'lucide-svelte';

	// Svelte 5 syntax. For older versions, use `export let data;`
	let { data } = $props();

	// Styles for news categories, adapted from your news list page
	const categoryStyles: Record<string, string> = {
		Funding: 'bg-accent/20 text-accent border-accent/50',
		Launch: 'bg-primary/20 text-primary border-primary/50',
		Award: 'bg-chart-5/20 text-chart-5 border-chart-5/50',
		Partnership: 'bg-chart-4/20 text-chart-4 border-chart-4/50',
		News: 'bg-muted/20 text-muted-foreground border-muted/50'
	};

	// Helper function to format the date string
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
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
						News Management
					</h1>
					<p class="mt-1 text-muted-foreground">Add, edit, or remove news articles.</p>
				</div>
				<Button href="/admin/news/create">
					<Plus class="mr-2 h-4 w-4" />
					Add New Article
				</Button>
			</div>
		</header>

		<div class="space-y-4">
			{#each data.news as article (article.id)}
				<div
					class="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary"
						>
							{#if article.imageUrl}
								<img src={article.imageUrl} alt={article.title} class="h-full w-full object-cover" />
							{:else}
								<!-- Fallback icon or initial for news can be generic -->
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
									<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4" />
									<path d="M14 2v4a2 2 0 0 0 2 2h4" />
									<path d="M14 12h-4" />
									<path d="M14 16h-4" />
									<path d="M8 8h2" />
								</svg>
							{/if}
						</div>
						<div>
							<p class="font-bold text-foreground">{article.title}</p>
							<p class="text-sm text-muted-foreground">
								Published on {formatDate(article.news_date)}
							</p>
						</div>
					</div>

					<div class="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-4">
						<span
							class="rounded-full border px-3 py-1 text-xs font-semibold {categoryStyles[
								article.category
							] ?? categoryStyles['News']}"
						>
							{article.category}
						</span>
						<!-- This button correctly links to the edit page for each specific article -->
						<Button href={`/admin/news/${article.id}/edit`} variant="outline" size="sm">
							Manage News
						</Button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>```