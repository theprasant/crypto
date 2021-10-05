const { SlashCommandBuilder } = require('@discordjs/builders');
// const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('console')
		.setDescription('logs the interaction'),
	async execute(interaction) {
		try {
			await interaction.deferReply({ ephemeral: true });
		//  await wait(4000);
		const cmd = await interaction.client.application.commands.fetch();
		cmd.map(c => {
			console.log(c.name);
		});
        await interaction.editReply('logged');
		// interaction.member.guild.commands.set([]);
		} catch (error) {
			interaction.errorReply('Some error occured lol ');
			console.error(error);
		}
	},
};