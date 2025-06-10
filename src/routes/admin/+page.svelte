<script lang="ts">
	import { auth } from '$lib/firebase';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { role, homepage } from '$lib/state.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let localLoading = $state(false);
	let errorMsg = $state(false);

	async function handleLogin() {
		localLoading = true;
		errorMsg = false;
		try {
			await signInWithEmailAndPassword(auth, email, password);
			localLoading = false;
		} catch (error) {
			console.error('Login failed:', error);
			localLoading = false;
			errorMsg = true;
			return;
		} finally {
			localLoading = false;
			goto('/');
		}
	}

	onMount(() => {
		homepage.value = false;
	});
</script>

{#if role.value !== 'guest'}
	<div class="flex flex-col gap-2">
		Redirecionando... ou volte manualmente <a href="/">clicando aqui</a>
		{#if localLoading}
			<div>Loading...</div>
		{/if}
	</div>
{:else}
	<div class="flex flex-col items-center gap-2">
		<h2>Login</h2>
		<form action="" onsubmit={handleLogin} class="flex flex-col gap-2">
			<input
				type="email"
				class="text-secondary placeholder:text-secondary/30 rounded-lg"
				name="user"
				id="user"
				bind:value={email}
				placeholder="Admin email"
			/>
			<input
				type="password"
				class="text-secondary placeholder:text-secondary/30 rounded-lg"
				name="password"
				id="password"
				bind:value={password}
				placeholder="Password"
			/>
			<input type="submit" class="rounded-lg bg-gray-600 p-3" value="Entrar" aria-label="Login" />
		</form>
		{#if errorMsg}
			<div class="text-red-500">Erro no login</div>
		{/if}
		{#if localLoading}
			<div>Loading...</div>
		{/if}
	</div>
{/if}
