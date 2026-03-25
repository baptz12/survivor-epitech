<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Sign In - JEB Incubator</title>
	<meta name="description" content="Sign in or activate your account" />
</svelte:head>

<div class="flex min-h-screen w-full items-center justify-center bg-background p-8 font-sans">
	<div
		class="w-full max-w-[420px] animate-[fadeIn_0.5s_ease-out] rounded-xl border border-border bg-card p-10"
	>
		<!-- Step 1: Email Prompt -->
		{#if !form?.step || form.step === 'email'}
			<h1 class="mb-2 text-center font-playfair text-3xl font-semibold text-foreground">Sign In</h1>
			<p class="mb-8 text-center text-muted-foreground">Enter your email to continue.</p>
			<form
				action="?/checkEmail"
				method="POST"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						await update();
						isLoading = false;
					};
				}}
				class="flex flex-col gap-5"
			>
				{#if form?.error}
					<div
						class="flex items-center gap-3 rounded-lg border border-destructive bg-destructive/20 px-4 py-3 text-sm text-destructive"
					>
						<svg
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"
							></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg
						>
						<span>{form.error}</span>
					</div>
				{/if}
				<div class="flex flex-col">
					<label for="email" class="mb-2 text-sm font-medium text-muted-foreground"
						>Email Address</label
					>
					<div class="relative flex items-center">
						<svg
							class="pointer-events-none absolute left-3 text-muted-foreground"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
							></path><polyline points="22,6 12,13 2,6"></polyline></svg
						>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							required
							value={form?.email ?? ''}
							class="w-full rounded-lg border border-input bg-input py-3 pr-3 pl-10 text-foreground transition duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring focus:outline-none"
						/>
					</div>
				</div>
				<button
					type="submit"
					class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-px hover:bg-primary/90 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-primary/50"
					disabled={isLoading}
				>
					{#if isLoading}
						<div
							class="h-[18px] w-[18px] animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
						></div>
						<span>Checking...</span>
					{:else}
						<span>Continue</span>
					{/if}
				</button>
			</form>
		{/if}
		<!-- Step 2: Password or Activation Prompt -->
		{#if form?.step === 'password' || form?.step === 'activate'}
			<h1 class="mb-2 text-center font-playfair text-3xl font-semibold text-foreground">
				{form.step === 'password' ? 'Welcome Back!' : 'Activate Your Account'}
			</h1>
			<p class="mb-1 text-center text-muted-foreground">
				{form.step === 'password'
					? 'Enter your password to sign in.'
					: 'Create a password to get started.'}
			</p>
			<div class="mb-6 text-center text-sm font-medium text-foreground/80">
				{form.email} (<a href="/auth/login" class="text-primary hover:underline">change</a>)
			</div>
			<form
				action="?/loginOrActivate"
				method="POST"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						await update();
						isLoading = false;
					};
				}}
				class="flex flex-col gap-5"
			>
				<input type="hidden" name="email" value={form.email} />
				<input
					type="hidden"
					name="intent"
					value={form.step === 'password' ? 'login' : 'activate'}
				/>
				{#if form?.error}
					<div
						class="flex items-center gap-3 rounded-lg border border-destructive bg-destructive/20 px-4 py-3 text-sm text-destructive"
					>
						<svg
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"
							></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg
						>
						<span>{form.error}</span>
					</div>
				{/if}
				<div class="flex flex-col">
					<label for="password" class="mb-2 text-sm font-medium text-muted-foreground"
						>Password</label
					>
					<div class="relative flex items-center">
						<svg
							class="pointer-events-none absolute left-3 text-muted-foreground"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path
								d="M7 11V7a5 5 0 0 1 10 0v4"
							></path></svg
						>
						<input
							id="password"
							name="password"
							type="password"
							placeholder={form.step === 'password' ? '••••••••' : 'Minimum 6 characters'}
							required
							class="w-full rounded-lg border border-input bg-input py-3 pr-3 pl-10 text-foreground transition duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring focus:outline-none"
							minlength={form.step === 'activate' ? 6 : undefined}
						/>
					</div>
				</div>
				<button
					type="submit"
					class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-px hover:bg-primary/90 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-primary/50"
					disabled={isLoading}
				>
					{#if isLoading}
						<div
							class="h-[18px] w-[18px] animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
						></div>
						<span>{form.step === 'password' ? 'Signing In...' : 'Activating...'}</span>
					{:else}
						<span>{form.step === 'password' ? 'Sign In' : 'Activate & Sign In'}</span>
					{/if}
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: translateY(-10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Style fix for browser autofill */
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	input:-webkit-autofill:active {
		/* Use var() for dynamic colors */
		-webkit-box-shadow: 0 0 0 30px var(--card) inset !important;
		-webkit-text-fill-color: var(--foreground) !important;
	}
</style>
