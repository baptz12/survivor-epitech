<!-- src/routes/projects/[id]/edit/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ArrowLeft, ImageUp, Trash2 } from 'lucide-svelte';

	// 1. Récupération des données avec $props
	let { data } = $props();

	// 2. Déclaration de l'état réactif avec $state
	let project = $state(data.project);
	let imagePreviewUrl = $state(project.picture_url || null);

	function handleImageSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			// La mise à jour de la variable $state déclenche la réactivité
			imagePreviewUrl = URL.createObjectURL(file);
		}
	}

	function confirmDelete(event: Event) {
		const confirmation = confirm('Are you sure you want to delete this project? This action cannot be undone.');
		if (!confirmation) {
			event.preventDefault();
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
				Edit Your Project
			</h1>
			<p class="mt-1 text-muted-foreground">
				Keep your project's information up-to-date to attract the right attention.
			</p>
		</header>

		<form method="POST" class="space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm" enctype="multipart/form-data">
			<!-- Image Upload Section -->
			<div class="space-y-2">
				<Label for="picture">Project Picture</Label>
				<div class="mt-1 flex items-center gap-6">
					<span
						class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-secondary"
					>
						<!-- La syntaxe du template reste la même -->
						{#if imagePreviewUrl}
							<img src={imagePreviewUrl} alt="Project preview" class="h-full w-full object-cover" />
						{:else}
							<ImageUp class="h-10 w-10 text-secondary-foreground" />
						{/if}
					</span>
					<label
						for="picture"
						class="cursor-pointer rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<span>Change picture</span>
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
				<!-- 3. Utilisation de bind:value pour la liaison de données -->
				<div class="space-y-2">
					<Label for="name">Project Name</Label>
					<Input
						id="name"
						name="name"
						placeholder="e.g., Project Nova"
						bind:value={project.name}
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="owner">Owner</Label>
					<Input
						id="owner"
						name="owner"
						placeholder="e.g., Jane Doe"
						bind:value={project.owner}
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="localisation">Localisation</Label>
					<Input
						id="localisation"
						name="localisation"
						placeholder="e.g., Paris, France"
						bind:value={project.localisation}
					/>
				</div>
				<div class="space-y-2">
					<Label for="theme">Theme / Sector</Label>
					<Input id="theme" name="theme" placeholder="e.g., Renewable Energy" bind:value={project.theme} />
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
						bind:value={project.founded_year}
					/>
				</div>
				<div class="space-y-2">
					<Label for="website_url">Website URL</Label>
					<Input
						id="website_url"
						name="website_url"
						type="url"
						placeholder="https://example.com"
						bind:value={project.website_url}
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
					bind:value={project.description}
				/>
			</div>

			<!-- Form Submission Buttons -->
			<div class="flex items-center justify-between border-t border-border pt-8">
				<!-- Delete Button -->
				<Button
					type="submit"
					variant="destructive"
					formaction="?/delete"
					on:click={confirmDelete}
					class="flex items-center gap-2"
				>
					<Trash2 class="h-4 w-4" />
					Delete Project
				</Button>

				<!-- Save Button -->
				<Button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90">
					Save Changes
				</Button>
			</div>
		</form>
	</div>
</div>