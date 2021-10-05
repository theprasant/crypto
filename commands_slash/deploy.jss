const { SlashCommandBuilder } = require('@discordjs/builders');
const { deploy } = require('../deploy-commands')
// const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('Deploys in dev guild')
    .addStringOption(option =>
        option.setName('command')
            .setDescription('command to be deployed')
            .setRequired(true)),
    // .addStringOption(option =>
    //     option.setName('all')
    //         .setDescription('command to be deployed')
    //         .setRequired(false)),
            
    async execute(interaction) {
        try {
            await interaction.deferReply();
            //  await wait(4000);
            // const cmd = await interaction.client.application.commands.fetch();
            // cmd.map(c => {
            // 	console.log(c.name);
            // });

            // let allCmd = interaction.options.getString('all');
            let cmd = interaction.options.getString('command');

            if(cmd && cmd.length){
               try{
                await deploy(interaction.client, cmd);
                await interaction.editReply(`Deployed command: \`${cmd}\` succesfully .`);
               }catch(e){
                   interaction.reply(`${e.message}`)
                   console.error(e)
               }
            }else{
                try{
                    await deploy(interaction.client)
                    await interaction.editReply(`Deployed all commands succesfully .`);
                   }catch(e){
                       interaction.reply(`${e.message}`)
                       console.error(e)
                   }
            }
            // interaction.member.guild.commands.set([]);
        } catch (error) {
            interaction.reply('Some error occured lol ');
            console.error(error);
        }
    },
};