<!-- src/routes/admin/events/[id]/edit/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ArrowLeft, Trash2 } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let data;
	let event = data.event;

	function confirmDelete(e: Event) {
		if (!confirm('Are you sure you want to delete this event? This action is permanent.')) {
			e.preventDefault();
		}
	}
</script>

<div class="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8">
			<Button variant="ghost" href="/startup/dashboard" class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>
			<h1 class="font-playfair text-3xl font-bold text-foreground md:text-4xl">Edit Event</h1>
			<p class="mt-1 text-muted-foreground">Update the details for this event.</p>
		</header>

		<form method="POST" class="space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2 md:col-span-2">
					<Label for="title">Event Title</Label>
					<Input id="title" name="title" value={event.title} required />
				</div>

				<div class="space-y-2">
					<Label for="category">Event Type</Label>
					<select
						id="category"
						name="category"
						bind:value={event.category}
						class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						required
					>
						<option value="Conference">Conference</option>
						<option value="Pitch Session">Pitch Session</option>
						<option value="Workshop">Workshop</option>
						<option value="Networking">Networking</option>
					</select>
				</div>

				<div class="space-y-2">
					<Label for="event_date">Date and Time</Label>
					<Input id="event_date" name="event_date" type="datetime-local" value={event.event_date} required />
				</div>

				<div class="space-y-2 md:col-span-2">
					<Label for="location">Location</Label>
					<Input id="location" name="location" value={event.location ?? ''} />
				</div>
			</div>

			<div class="space-y-2">
				<Label for="description">Description</Label>
				<Textarea
					id="description"
					name="description"
					class="min-h-[200px]"
					value={event.description}
					required
				/>
			</div>

			{#if $page.form?.error}
				<p class="text-sm font-medium text-destructive">{$page.form.error}</p>
			{/if}
			{#if $page.form?.success}
				<p class="text-sm font-medium text-primary">{$page.form.message}</p>
			{/if}

			<div class="flex items-center justify-between border-t border-border pt-8">
				<Button
					type="submit"
					variant="destructive"
					formaction="?/delete"
					on:click={confirmDelete}
					class="flex items-center gap-2"
				>
					<Trash2 class="h-4 w-4" />
					Delete Event
				</Button>

				<Button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90">
					Save Changes
				</Button>
			</div>
		</form>
	</div>
</div>