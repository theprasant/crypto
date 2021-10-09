const { createChannel } = require('../../libs/create/createChannel');
const { Game } = require('../../libs/gamelibs/basicGameClass')

module.exports = {
    name: 'stop',
    description: 'stop the current game!',
    inDevMode: true,
    // myChannelPerms:['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: false,
    async execute(message, args) {
        try {

            if(!message.guild.currentGames || !message.guild.currentGames.length) return message.reply(`Currently no one is playing in this server.`);

            let currentGame = message.guild.currentGames.filter(game => {
                return game.channelId == message.channel.id;
            })[0];

            // console.log(currentGame)
            if(!currentGame) return message.reply(`There is no game in this channel currently.`)
            if(currentGame.channelId != message.channel.id){
                console.log(`current channel id : ${message.channel.id}`)
                console.log(`current game  : ${currentGame}`)
                return message.reply(`Please execute the command in that channel where you are playing.`)
            }

            let channelName = message.channel.name;

            await message.guild.currentGames.splice(message.guild.currentGames.indexOf(currentGame), 1);
            await message.client.channels.fetch(currentGame.channelId).then (c => c.delete() )
            await message.client.channels.fetch("895296925518151751").then (c => c.send(`channel \`#${channelName}\` is deleted and game of index ${currentGame.index} is removed <@745688196440129915>`) )

            // message.guild.currentGames.map(g => {
            //     if(g.channelId == "April") months.splice(months.indexOf(m), 1);
            //   } )

        } catch (err) {
            console.error(err);
            message.channels.send(`\`\`\`xl\n${err.message}\n\`\`\``)
        }
    },
};