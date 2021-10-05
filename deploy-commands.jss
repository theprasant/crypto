require('dotenv').config();
// const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');

const fs = require('fs');


async function deploy(client, cmds) {

    // console.log(cmds)

    let globalcmds = [];
    // console.log(client)
    // return;

    let cmd = await client.application.commands.fetch()
    cmd.map(c => {
        globalcmds.push(c.name)
    });

    const commands = [];
    const commandFiles = fs.readdirSync('./commands_slash').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands_slash/${file}`);
        commands.push(command.data.toJSON());
    }

    let deployableCommands;

    deployableCommands = commands.filter(c => {
        return !globalcmds.includes(c.name);
    })

    if(cmds){
        deployableCommands.map(c => {
            // console.log(c.name, cmds, c.name == cmds)
            if(c.name == cmds){
                deployableCommands[deployableCommands.indexOf(c)] = `${c.name} command changed!`;
                // console.log(deployableCommands[deployableCommands.indexOf(c)])
            }
        })
    }

    console.log(deployableCommands)
    return;

    // if(cmds){
    //     deployableCommands = commands.filter(c => {
    //         return c.name == cmds;
    //     })
    // }else{
    //     deployableCommands = commands.filter(c => {
    //         return !globalcmds.includes(c.name);
    //     })
    // }

    // let restExpCmds = commands.filter(c => {
    //     return !globalcmds.includes(c.name);
    // })

    // let specifiedCommand = commands.filter(c => {
    //     return !globalcmds.includes(c.name);
    // })

    const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.', guildId);
            console.log(deployableCommands)
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: deployableCommands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();

    console.log(`Deployed cmds: \n\n ${deployableCommands} \n`)
}

// export default deploy;
module.exports = {deploy}