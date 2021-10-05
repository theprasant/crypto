const { createChannel } = require('../../libs/create/createChannel');
const { Game } = require('../../libs/gamelibs/basicGameClass')

module.exports = {
    name: 'play',
    description: 'Play your favourite game!',
    inDevMode: true,
    // myChannelPerms:['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: false,
    execute(message, args) {
        try {

            let cname = `${Date.now()}`;
            let currentIndex;
            let perms = ["VIEW_CHANNEL", "SEND_MESSAGES"];
            let secondUser = message.mentions.users.first();

            if (!secondUser) return message.reply(`Sorry, you have to mention a user to create a channel.`)
            if (secondUser.id == message.author.id) return message.reply(`Sorry, you can't play with yourself. \n https://c.tenor.com/yheo1GGu3FwAAAAM/rick-roll-rick-ashley.gif`);

            if (!message.guild.currentGames || !message.guild.currentGames.length) {
                message.guild.currentGames = []
                currentIndex = 1;
                cname = `${this.name}-play-1`;
            } else {
                // let lastGame = message.guild.currentGames[message.guild.currentGames.lenght - 1];

                for (let i = 0; i < message.guild.currentGames.length; i++) {
                    for (let user = 0; user < message.guild.currentGames[i].users.length; user++) {
                        if (message.guild.currentGames[i].users[user].id == message.author.id || message.guild.currentGames[i].users[user].id == secondUser.id) return message.reply(`The mentioned user or You are already playing a gem. Try again after completeing that lol...`)
                    }

                    if (message.guild.currentGames[i + 1] == undefined || message.guild.currentGames[i].index + 1 != message.guild.currentGames[i + 1].index) {
                        // message.channel.send(`${i + 1}exists but adding new obj at ${i + 1 + 1}`);
                        // return message.guild.currentGames.splice(i+1, 0, i+1+1);
                        currentIndex = message.guild.currentGames[i].index + 1;
                        cname = `${this.name}-play-${currentIndex}`;

                        break;
                    }
                }


                //ref

                // let x = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 5 }, { n: 6 }]
                // for (let i = 0; i < x.length; i++) {
                //     if (x[i + 1] == undefined || x[i].n + 1 != x[i + 1].n) {
                //         message.channel.send(`${x[i].n} exists but adding new obj at ${x[i].n + 1}`);
                //     } else {
                //         message.channel.send(`**${x[i].n}** and ${x[i + 1].n} correct`)
                //     }
                // }


            }
            // let lastGame = message.guild.currentGames[message.guild.currentGames.lenght - 1]

            // if (!secondUser) return message.reply(`Sorry, you have to mention a user to create a channel.`)
            createChannel(message, cname, secondUser, perms, async (c) => {
                let newGame = new Game(currentIndex, c.id, [message.author, message.mentions.users.first()])

                await message.channel.send(`Created channel ${c} of id : ${c.id}, index : ${currentIndex} , with permissions ${perms} for users ${message.author} and ${message.mentions.users.first()}`)
                // message.guild.currentGames.push(newGame);
                message.guild.currentGames.splice(currentIndex - 1, 0, newGame);
            });
        } catch (err) {
            console.error(err);
            message.channels.send(`\`\`\`xl\n${err.message}\n\`\`\``)
        }
    },
};