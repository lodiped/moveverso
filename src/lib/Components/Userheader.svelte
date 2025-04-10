<script>
	import { titles } from '$lib/state.svelte';
	let { user } = $props();
</script>

<div class="flex flex-col items-center justify-center gap-5">
	<div class="bg-secondary flex h-20 w-20 items-center justify-center rounded-3xl text-white">
		foto
	</div>
	<div class="flex flex-col items-center justify-center gap-2">
		<h2>{user.name}</h2>
		<div class="flex flex-col items-center justify-center">
			<p>
				Fase {user.fase + 1}:
			</p>
			<p class="font-magic text-4xl font-bold">{titles.fase[user.fase].title}</p>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p>
				Nivel {user.nivel + 1}:
			</p>
			<p class="font-magic text-3xl font-bold">{titles.fase[user.fase].nivel[user.nivel]}</p>
		</div>
		<p>Pontos: <span>{user.current}</span></p>
		<div class="bg-secondary relative h-5 w-full rounded-md">
			<div
				class="bg-accent absolute top-0 left-0 h-full w-full rounded-md content-['']"
				style={`width: ${user.current / 15}%;`}
			></div>
			<div class="bg-bg absolute top-0 left-[9%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[19%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[29%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[39%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[49%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[59%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[69%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[79%] h-full w-1"></div>
			<div class="bg-bg absolute top-0 left-[89%] h-full w-1"></div>
		</div>
		<p>Progresso Total: <span>{user.total}</span></p>
		<div class="bg-secondary relative h-5 w-full rounded-md">
			<div
				class="bg-accent absolute top-0 left-0 h-full w-full rounded-md content-['']"
				style={`width: ${user.total / 75}%;`}
			></div>
		</div>
	</div>
</div>
