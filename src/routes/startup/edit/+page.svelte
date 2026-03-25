<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { ArrowLeft } from 'lucide-svelte';

	let { data, form } = $props();

	// Use a reactive statement to ensure the form data is always up-to-date
	let startup = $derived(data.startup);
</script>

<svelte:head>
	<title>Edit Profile - JEB Incubator</title>
	<meta
		name="description"
		content="Update your startup profile information to attract the right investors and opportunities. Keep your project details current."
	/>
</svelte:head>

<div class="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8">
			<Button variant="ghost" href="/startup/dashboard" class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>
			<h1 class="font-playfair text-3xl font-bold text-foreground">Edit Your Startup Profile</h1>
			<p class="mt-1 text-muted-foreground">
				Keep your information up-to-date to attract the right investors and opportunities.
			</p>
		</header>
		<form
			method="POST"
			use:enhance={() => {
				return async ({ update }) => {
					update({ reset: false });
				};
			}}
			class="space-y-8 rounded-xl border border-border bg-card p-8"
		>
			<div class="space-y-2">
				<Label>Current Logo</Label>
				<div class="flex items-center gap-4">
					{#if startup.image_path}
						<img
							src={startup.image_path}
							alt="{startup.name} logo"
							class="h-20 w-20 rounded-lg border object-cover"
						/>
					{:else}
						<div
							class="flex h-20 w-20 items-center justify-center rounded-lg border bg-muted text-muted-foreground"
						>
							No Image
						</div>
					{/if}
					<p class="text-xs text-muted-foreground">
						To change the logo, please contact the incubator administration. This feature is
						automatically synced.
					</p>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="name">Startup Name</Label>
					<Input
						id="name"
						name="name"
						placeholder="e.g., QuantumLeap AI"
						value={startup.name ?? ''}
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="sector">Sector / Industry</Label>
					<Input
						id="sector"
						name="sector"
						placeholder="e.g., Artificial Intelligence"
						value={startup.sector ?? ''}
					/>
				</div>
				<div class="space-y-2">
					<Label for="maturity">Maturity Stage</Label>
					<Input
						id="maturity"
						name="maturity"
						placeholder="e.g., Seed Stage"
						value={startup.maturity ?? ''}
					/>
				</div>
				<div class="space-y-2">
					<Label for="project_status">Project Status</Label>
					<Input
						id="project_status"
						name="project_status"
						placeholder="e.g., MVP Live"
						value={startup.project_status ?? ''}
					/>
				</div>
			</div>

			<div class="space-y-2">
				<Label for="description">Description</Label>
				<Textarea
					id="description"
					name="description"
					placeholder="Tell us about your project, your mission, and the problem you're solving."
					class="min-h-[120px]"
					value={startup.description ?? ''}
				/>
			</div>

			<div class="space-y-2">
				<Label for="needs">Current Needs</Label>
				<Textarea
					id="needs"
					name="needs"
					placeholder="What are you looking for? e.g., 'Seeking $500k seed funding for market expansion...'"
					class="min-h-[80px]"
					value={startup.needs ?? ''}
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="website_url">Website URL</Label>
					<Input
						id="website_url"
						name="website_url"
						type="url"
						placeholder="https://example.com"
						value={startup.website_url ?? ''}
					/>
				</div>
				<div class="space-y-2">
					<Label for="social_media_url">Social Media (LinkedIn, etc.)</Label>
					<Input
						id="social_media_url"
						name="social_media_url"
						type="url"
						placeholder="https://linkedin.com/company/example"
						value={startup.social_media_url ?? ''}
					/>
				</div>
				<div class="space-y-2">
					<Label for="phone">Contact Phone</Label>
					<Input
						id="phone"
						name="phone"
						type="tel"
						placeholder="+1234567890"
						value={startup.phone ?? ''}
					/>
				</div>
				<div class="space-y-2">
					<Label for="address">Address / Location</Label>
					<Input
						id="address"
						name="address"
						placeholder="City, Country"
						value={startup.address ?? ''}
					/>
				</div>
				<div class="space-y-2">
					<Label for="legal_status">Legal Status</Label>
					<Input
						id="legal_status"
						name="legal_status"
						placeholder="e.g., LLC, Corporation"
						value={startup.legal_status ?? ''}
					/>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div>
					{#if form?.success}
						<p class="text-sm font-medium text-primary">{form.message}</p>
					{:else if form?.message && !form.success}
						<p class="text-sm font-medium text-destructive">{form.message}</p>
					{/if}
				</div>
				<Button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90">
					Save Changes
				</Button>
			</div>
		</form>
	</div>
</div>
