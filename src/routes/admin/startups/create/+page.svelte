<!-- src/routes/projects/create/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ArrowLeft, ImageUp } from 'lucide-svelte';

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
		<!-- Page Header -->
		<header class="mb-8">
			<Button variant="ghost" href="/startup/dashboard" class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>
			<h1 class="font-playfair text-3xl font-bold text-foreground md:text-4xl">
				Create a New Project
			</h1>
			<p class="mt-1 text-muted-foreground">
				Fill out the details below to get your project profile up and running.
			</p>
		</header>

		<!-- Project Configuration Form -->
		<form method="POST" class="space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
			<!-- Image Upload Section -->
			<div class="space-y-2">
				<Label for="picture">Project Picture</Label>
				<div class="mt-1 flex items-center gap-6">
					<span
						class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-secondary"
					>
						{#if imagePreviewUrl}
							<img
								src={imagePreviewUrl}
								alt="Project preview"
								class="h-full w-full object-cover"
							/>
						{:else}
							<ImageUp class="h-10 w-10 text-secondary-foreground" />
						{/if}
					</span>
					<label
						for="picture"
						class="cursor-pointer rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<span>Upload a file</span>
						<input
							id="picture"
							name="picture"
							type="file"
							class="sr-only"
							accept="image/*"
							on:change={handleImageSelect}
						/>
					</label>
				</div>
			</div>

			<!-- Core Details Grid -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="name">Project Name</Label>
					<Input id="name" name="name" placeholder="e.g., Project Nova" required />
				</div>
				<div class="space-y-2">
					<Label for="owner">Owner</Label>
					<Input id="owner" name="owner" placeholder="e.g., Jane Doe" required />
				</div>
				<div class="space-y-2">
					<Label for="localisation">Localisation</Label>
					<Input id="localisation" name="localisation" placeholder="e.g., Paris, France" />
				</div>
				<div class="space-y-2">
					<Label for="theme">Theme / Sector</Label>
					<Input id="theme" name="theme" placeholder="e.g., Renewable Energy" />
				</div>
				<div class="space-y-2">
					<Label for="founded_year">Year Founded</Label>
					<Input
						id="founded_year"
						name="founded_year"
						type="number"
						placeholder="e.g., 2024"
						min="1900"
						max={new Date().getFullYear()}
					/>
				</div>
				<div class="space-y-2">
					<Label for="website_url">Website URL</Label>
					<Input
						id="website_url"
						name="website_url"
						type="url"
						placeholder="https://example.com"
					/>
				</div>
			</div>

			<!-- Description Textarea -->
			<div class="space-y-2">
				<Label for="description">Quick Description</Label>
				<Textarea
					id="description"
					name="description"
					placeholder="Briefly describe your project, its mission, and its goals."
					class="min-h-[120px]"
				/>
			</div>

			<!-- Form Submission -->
			<div class="flex justify-end">
				<Button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90">
					Create Project
				</Button>
			</div>
		</form>
	</div>
</div>