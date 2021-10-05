const { SlashCommandBuilder } = require('@discordjs/builders');
// const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leaves server'),
	async execute(interaction) {
		try {
			await interaction.deferReply();
            await interaction.editReply('Bye Bye ! Ta Ta ! see you!');
            interaction.member.guild.leave();
		} catch (error) {
			interaction.errorReply('Some error occured lol ');
			console.error(error);
		}
	},
};