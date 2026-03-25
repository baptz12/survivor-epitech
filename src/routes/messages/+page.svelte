<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Send, ArrowLeft } from 'lucide-svelte';
	let { data } = $props();
	let messageContainer: HTMLElement = $state();
	let selectedConv = $state(null);
	let messageContent = $state('');
	let inputElement = $state(null as HTMLInputElement | null);
	$effect(() => {
		selectedConv = data.selectedConversation;
	});
	// Scroll to the bottom of the message container when new messages arrive or conversation changes
	$effect(() => {
		const len = selectedConv?.messages?.length;
		if (selectedConv && messageContainer) {
			messageContainer.scrollTo({
				top: messageContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	});
	// --- SSE Implementation ---
	$effect(() => {
		let eventSource: EventSource | null = null;
		const conversationId = data.selectedConversation?.id;
		if (conversationId) {
			eventSource = new EventSource(`/api/messages/${conversationId}/events`);
			eventSource.addEventListener('message', (event) => {
				const newMessage = JSON.parse(event.data);
				// Defensively check if the message isn't already in the list to avoid duplicates
				if (selectedConv && !selectedConv.messages.find((m) => m.id === newMessage.id)) {
					selectedConv.messages.push(newMessage);
				}
			});
			eventSource.addEventListener('error', (err) => {
				console.error('EventSource failed:', err);
				eventSource?.close();
			});
		}
		// Svelte's $effect automatically handles cleanup. When the selected conversation
		// changes or the component is unmounted, this function will be called.
		return () => {
			if (eventSource) {
				eventSource.close();
			}
		};
	});
	function getParticipant(conv, profileType) {
		return profileType === 'startup' ? conv.investor : conv.startup;
	}
	async function sendMessage() {
		if (!messageContent.trim() || !selectedConv) return;
		const formData = new FormData();
		formData.append('content', messageContent);
		formData.append('conversationId', selectedConv.id.toString());
		const response = await fetch('?/sendMessage', {
			method: 'POST',
			body: formData
		});
		if (response.ok) {
			messageContent = '';
			if (inputElement) {
				inputElement.focus();
			}
		} else {
			// Handle error if needed
			console.error('Failed to send message');
		}
	}
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

<svelte:head>
	<title>Messages - JEB Incubator</title>
</svelte:head>
<div class="flex h-[calc(100vh-4rem)] border-t">
	<!-- Sidebar: Conversation List -->
	<aside class="flex w-full flex-col border-r md:w-1/3 lg:w-1/4">
		<div class="flex items-center justify-between border-b p-4">
			<h2 class="font-playfair text-xl font-bold">Conversations</h2>
			<Button
				variant="ghost"
				size="sm"
				href={data.currentUser.role === 'founder' ? '/startup/dashboard' : '/investor/dashboard'}
			>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back
			</Button>
		</div>
		<ScrollArea class="flex-1">
			<ul>
				{#each data.conversations as conv (conv.id)}
					{@const participant = getParticipant(conv, data.profileType)}
					<li>
						<a
							href="/messages?id={conv.id}"
							class="block p-4 hover:bg-muted {$page.url.searchParams.get('id') ==
							conv.id.toString()
								? 'bg-muted'
								: ''}"
						>
							<div class="flex items-center space-x-3">
								<div class="flex-shrink-0">
									{#if participant.image_path}
										<img
											class="h-10 w-10 rounded-full object-cover"
											src={participant.image_path}
											alt={participant.name}
										/>
									{:else}
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-lg font-bold"
										>
											{participant.name.charAt(0)}
										</div>
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<p class="truncate font-semibold">{participant.name}</p>
									<p class="truncate text-sm text-muted-foreground">
										{conv.messages[0]?.content ?? 'No messages yet'}
									</p>
								</div>
							</div>
						</a>
					</li>
				{:else}
					<p class="p-4 text-center text-sm text-muted-foreground">No conversations yet.</p>
				{/each}
			</ul>
		</ScrollArea>
	</aside>
	<!-- Main: Chat Window -->
	<main class="hidden flex-1 flex-col md:flex">
		{#if selectedConv}
			{@const participant = getParticipant(selectedConv, data.profileType)}
			<!-- Chat Header -->
			<div class="flex items-center gap-3 border-b p-4">
				{#if participant.image_path}
					<img
						class="h-10 w-10 rounded-full object-cover"
						src={participant.image_path}
						alt={participant.name}
					/>
				{:else}
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg font-bold"
					>
						{participant.name.charAt(0)}
					</div>
				{/if}
				<h3 class="text-lg font-semibold">{participant.name}</h3>
			</div>
			<!-- Message Area -->
			<div class="flex-1 overflow-y-auto p-6" bind:this={messageContainer}>
				<div class="space-y-4">
					{#each selectedConv.messages as message (message.id)}
						<div
							class="flex items-end gap-2 {message.senderId === data.currentUser.id
								? 'justify-end'
								: 'justify-start'}"
						>
							<!-- Avatar for other user -->
							{#if message.senderId !== data.currentUser.id}
								{#if message.sender.image_path}
									<img
										class="h-8 w-8 flex-shrink-0 rounded-full object-cover"
										src={message.sender.image_path}
										alt={message.sender.name}
									/>
								{:else}
									<div
										class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold"
									>
										{message.sender.name.charAt(0)}
									</div>
								{/if}
							{/if}
							<!-- Message Bubble -->
							<div
								class="max-w-xs rounded-lg px-4 py-2 md:max-w-md lg:max-w-lg {message.senderId ===
								data.currentUser.id
									? 'bg-primary text-primary-foreground'
									: 'bg-muted'}"
							>
								<p class="text-sm">{message.content}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<!-- Message Input -->
			<div class="border-t bg-background p-4">
				<div class="flex items-center gap-2">
					<Input
						bind:this={inputElement}
						bind:value={messageContent}
						placeholder="Type a message..."
						autocomplete="off"
						onkeydown={handleKeydown}
					/>
					<Button onclick={sendMessage} size="icon" aria-label="Send Message">
						<Send class="h-4 w-4" />
					</Button>
				</div>
			</div>
		{:else}
			<div class="flex flex-1 items-center justify-center">
				<div class="text-center">
					<h3 class="text-xl font-semibold">Select a conversation</h3>
					<p class="text-muted-foreground">
						Choose a conversation from the list to start chatting.
					</p>
				</div>
			</div>
		{/if}
	</main>
</div>
