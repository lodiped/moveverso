<script>
	let { user } = $props();
</script>

<div class="flex flex-col items-center justify-center gap-5">
	<div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-400 text-white">
		foto
	</div>
	<div class="flex flex-col items-center justify-center">
		<h2>Nome Sobrenome</h2>
		<p>Fase: <span>{user.fase}</span></p>
		<p>Nivel: <span>{user.nivel}</span></p>
		<p>Current: <span>{user.current}</span></p>
		<div class="relative h-5 w-full rounded-md bg-gray-400">
			<div
				class="absolute top-0 left-0 h-full w-full rounded-md bg-yellow-500 content-['']"
				style={`width: ${user.current / 15}%;`}
			></div>
			<div class="absolute top-0 left-[9%] h-full w-1 bg-white"></div>
			<div class="absolute top-0 left-[19%] h-full w-1 bg-white"></div>
			<div class="absolute top-0 left-[29%] h-full w-1 bg-white"></div>
			<div class="absolute top-0 left-[39%] h-full w-1 bg-white"></div>
			<div class="absolute top-0 left-[49%] h-full w-1 bg-white"></div>
			<div class="absolute top-0 left-[59%] h-full w-1 bg-white"></div>
			<div class="absolute top-0 left-[69%] h-full w-1 bg-white"></div>
			<div class="absolute top-0 left-[79%] h-full w-1 bg-white"></div>
			<div class="absolute top-0 left-[89%] h-full w-1 bg-white"></div>
		</div>
		<p>Total de pontos: <span>{user.total}</span></p>
		<div class="relative h-5 w-full rounded-md bg-gray-400">
			<div
				class="absolute top-0 left-0 h-full w-full rounded-md bg-yellow-500 content-['']"
				style={`width: ${user.total / 150}%;`}
			></div>
		</div>
	</div>
</div>
