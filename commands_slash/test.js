const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Replies with toast!'),
	async execute(interaction) {
		try {
			await interaction.deferReply();
		await wait(4000);
		await interaction.editReply('No toast Lol!');
		} catch (error) {
			interaction.errorReply('Some error occured lol ');
			console.error(error);
		}
	},
};