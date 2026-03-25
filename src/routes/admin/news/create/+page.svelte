<!-- src/routes/admin/news/create/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ArrowLeft, ImageUp } from 'lucide-svelte';
	import { page } from '$app/stores';

	let imagePreviewUrl: string | null = null;

	function handleImageSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			imagePreviewUrl = URL.createObjectURL(file);
		}
	}
</script>

<div class="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8">
			<Button variant="ghost" href="/admin/news" class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to News
			</Button>
			<h1 class="font-playfair text-3xl font-bold text-foreground md:text-4xl">
				Create New Article
			</h1>
			<p class="mt-1 text-muted-foreground">Fill out the details to publish a new article.</p>
		</header>

		<form method="POST" class="space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
			<div class="space-y-2">
				<Label for="title">Article Title</Label>
				<Input id="title" name="title" placeholder="e.g., Announcing Our Series A Funding" required />
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="category">Category</Label>
					<select
						id="category"
						name="category"
						class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="News">General News</option>
						<option value="Launch">Launch</option>
						<option value="Funding">Funding</option>
						<option value="Award">Award</option>
						<option value="Partnership">Partnership</option>
					</select>
				</div>
				<div class="space-y-2">
					<Label for="location">Location</Label>
					<Input id="location" name="location" placeholder="e.g., Global or City, Country" />
				</div>
				<div class="space-y-2">
					<Label for="news_date">Publication Date</Label>
					<Input id="news_date" name="news_date" type="date" required />
				</div>
			</div>

			<div class="space-y-2">
				<Label for="image_path">Featured Image</Label>
				<div class="mt-1 flex items-center gap-6">
					<span
						class="flex h-24 w-40 items-center justify-center overflow-hidden rounded-md bg-secondary"
					>
						{#if imagePreviewUrl}
							<img
								src={imagePreviewUrl}
								alt="Featured image preview"
								class="h-full w-full object-cover"
							/>
						{:else}
							<ImageUp class="h-10 w-10 text-secondary-foreground" />
						{/if}
					</span>
					<label
						for="image_path"
						class="cursor-pointer rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<span>Upload image</span>
						<input
							id="image_path"
							name="image_path"
							type="file"
							class="sr-only"
							accept="image/*"
							on:change={handleImageSelect}
						/>
					</label>
				</div>
			</div>

			<div class="space-y-2">
				<Label for="description">Content (Markdown supported)</Label>
				<Textarea
					id="description"
					name="description"
					placeholder="Write your article content here..."
					class="min-h-[250px] font-mono"
					required
				/>
			</div>

			{#if $page.form?.error}
				<p class="text-sm font-medium text-destructive">{$page.form.error}</p>
			{/if}

			<div class="flex justify-end">
				<Button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90">
					Publish Article
				</Button>
			</div>
		</form>
	</div>
</div>