export default {
	async queue(batch, env): Promise<void> {
		for (let message of batch.messages) {
			const res = await fetch(`http://localhost:3000/api/ai?filename=${message.body.object.key}`);
			console.log(JSON.stringify(res));
		}
	},
} satisfies ExportedHandler<Env, Error>;
