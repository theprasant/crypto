const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		try {
			await interaction.deferReply();
		await wait(4000);
		await interaction.editReply('Pong Pong Pong Haha!');
		} catch (error) {
			interaction.errorReply('Some error occured lol ');
			console.error(error);
		}
	},
};