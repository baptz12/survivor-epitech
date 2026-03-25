<!-- src/routes/admin/users/[id]/edit/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ArrowLeft, Trash2, KeyRound } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let user = $state(data.user);

	// Use image_path from the database and handle local file previews
	let imagePreviewUrl = $state(user.image_path || null);

	function handleImageSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			imagePreviewUrl = URL.createObjectURL(input.files[0]);
		}
	}
</script>

<div class="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-2xl">
		<header class="mb-8">
			<Button variant="ghost" href="/admin/users" class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to User List
			</Button>
			<h1 class="font-playfair text-3xl font-bold text-foreground md:text-4xl">Edit User</h1>
			<p class="mt-1 text-muted-foreground">Modify account details and permissions.</p>
		</header>

		<form
			method="POST"
			action="?/update"
			enctype="multipart/form-data"
			class="space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm"
			use:enhance
		>
			<!-- Image and Core Details -->
			<div class="flex flex-col gap-6 sm:flex-row">
				<div class="flex-shrink-0 space-y-2">
					<Label for="picture">Profile Picture</Label>
					<div
						class="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-secondary"
					>
						{#if imagePreviewUrl}
							<img src={imagePreviewUrl} alt="User" class="h-full w-full object-cover" />
						{:else}
							<span
								class="flex h-full w-full items-center justify-center text-4xl font-bold text-secondary-foreground"
							>
								{user.name.charAt(0)}
							</span>
						{/if}
					</div>
					<Input
						id="picture"
						name="picture"
						type="file"
						class="hidden"
						onchange={handleImageSelect}
						accept="image/*"
					/>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onclick={() => document.getElementById('picture')?.click()}
					>
						Change Image
					</Button>
				</div>
				<div class="flex-grow space-y-6">
					<div class="space-y-2">
						<Label for="name">Full Name</Label>
						<Input id="name" name="name" bind:value={user.name} required />
					</div>
					<div class="space-y-2">
						<Label for="email">Email Address</Label>
						<Input id="email" name="email" type="email" bind:value={user.email} required />
					</div>
				</div>
			</div>

			<!-- Role Selection -->
			<div class="space-y-2">
				<Label for="role" class="text-base">Role</Label>
				<select
					id="role"
					name="role"
					bind:value={user.role}
					class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2"
				>
					{#each Object.entries(data.roles) as [key, displayName]}
						<option value={key}>{displayName}</option>
					{/each}
				</select>
			</div>

			{#if $page.form?.message}
				<p
					class="text-sm font-medium"
					class:text-primary={$page.form?.success}
					class:text-destructive={!$page.form?.success}
				>
					{$page.form.message}
				</p>
			{/if}

			<!-- Action Buttons -->
			<div class="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
				<Button
					type="submit"
					variant="destructive"
					formaction="?/delete"
					on:click={(e) => {
						if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) {
							e.preventDefault();
						}
					}}
					class="flex items-center gap-2"
				>
					<Trash2 class="h-4 w-4" />
					Delete User
				</Button>

				<div class="flex items-center gap-2">
					<Button
						type="submit"
						variant="secondary"
						formaction="?/clearPassword"
						on:click={(e) => {
							if (
								!confirm(
									"Are you sure you want to clear this user's password and send a reset link?"
								)
							) {
								e.preventDefault();
							}
						}}
						class="flex items-center gap-2"
					>
						<KeyRound class="h-4 w-4" />
						Clear Password
					</Button>
					<Button type="submit">Save Changes</Button>
				</div>
			</div>
		</form>
	</div>
</div>
