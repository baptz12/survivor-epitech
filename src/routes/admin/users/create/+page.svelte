<!-- src/routes/admin/roles/create/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ArrowLeft } from 'lucide-svelte';
</script>

<div class="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-2xl">
		<header class="mb-8">
			<Button variant="ghost" href="/admin/users" class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to User List
			</Button>
			<h1 class="font-playfair text-3xl font-bold text-foreground md:text-4xl">Add a New User</h1>
			<p class="mt-1 text-muted-foreground">Create a new account and assign a role.</p>
		</header>

		<form method="POST" class="space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="name">Full Name</Label>
					<Input id="name" name="name" required />
				</div>
				<div class="space-y-2">
					<Label for="email">Email Address</Label>
					<Input id="email" name="email" type="email" required />
				</div>
			</div>
			<div class="space-y-2">
				<Label for="role">Role</Label>
				<select
					id="role"
					name="role"
					class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background"
					required
				>
					<option value="Viewer">Viewer</option>
					<option value="Investor">Investor</option>
					<option value="Startup Founder">Startup Founder</option>
					<option value="Editor">Editor</option>
					<option value="Admin">Administrator</option>
				</select>
			</div>
			<div class="flex justify-end border-t border-border pt-6">
				<Button type="submit">Create User</Button>
			</div>
		</form>
	</div>
</div>
