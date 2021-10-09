const fetch = require('node-fetch');
const { createChannel } = require('../../libs/create/createChannel');
const { Game } = require('../../libs/gamelibs/basicGameClass')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'trivia',
    description: 'Trivia quize!',
    myChannelPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: true,
    async execute(message) {

        try {
            msg = await message.channel.send(`<a:gsearchgif:894799755278958602> Making a pizza ...`);

            // new channel create info start
            let cname = `${Date.now()}`;
            let currentIndex;
            let perms = ["VIEW_CHANNEL", "SEND_MESSAGES"];
            let secondUser = message.mentions.users.first();

            if (!secondUser) return msg.edit(`Sorry, you have to mention a user to create a channel.`)
            if (secondUser.id == message.author.id) return msg.edit(`Sorry, you can't play with yourself. \n https://c.tenor.com/yheo1GGu3FwAAAAM/rick-roll-rick-ashley.gif`);

            if (!message.guild.currentGames || !message.guild.currentGames.length) {
                message.guild.currentGames = []
                currentIndex = 1;
                cname = `${this.name}-play-1`;
            } else {
                for (let i = 0; i < message.guild.currentGames.length; i++) {
                    for (let user = 0; user < message.guild.currentGames[i].users.length; user++) {
                        if (message.guild.currentGames[i].users[user].id == message.author.id || message.guild.currentGames[i].users[user].id == secondUser.id) return msg.edit(`The mentioned user or You are already playing a gem. Try again after completeing that lol...`)
                    }

                    if (message.guild.currentGames[i + 1] == undefined || message.guild.currentGames[i].index + 1 != message.guild.currentGames[i + 1].index) {
                        currentIndex = message.guild.currentGames[i].index + 1;
                        cname = `${this.name}-play-${currentIndex}`;

                        break;
                    }
                }
            }
            // new channel create info end

            // startQuiz function start - will add to module
            let newMsg;
            const startQuiz = async (channel) => {
                if(!newMsg){
                    newMsg = await channel.send(`<a:gsearchgif:894799755278958602> Making a pizza ...`);
                }
                 let quizes = await fetch('https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple&encode=url3986').then(d => d.json());
                 
                 const exampleEmbed = new MessageEmbed()
                     .setColor('#0099ff')
                     .setTitle(`${message.author.tag}`)
                     .setThumbnail(`${message.author.avatarURL()}`)
                     .setDescription(`**Question**\n${decodeURIComponent(quizes.results[0].question)}\n\n**Options**\n1)  ${decodeURIComponent(quizes.results[0].incorrect_answers[0])}\n2) ${decodeURIComponent(quizes.results[0].correct_answer)}\n3) ${decodeURIComponent(quizes.results[0].incorrect_answers[1])}\n4) ${decodeURIComponent(quizes.results[0].incorrect_answers[2])}
                     `)
                     .setTimestamp()
                     .setFooter('1/1', `${message.client.user.avatarURL()}`);
     
                     newMsg.edit({content: 'Here is your question.', embeds: [exampleEmbed] });
             }
            // startQuiz function end - will add to module

            //channel create start
            createChannel(message, cname, secondUser, perms, async (c) => {
                let newGame = new Game(currentIndex, c.id, [message.author, message.mentions.users.first()])
                await message.guild.currentGames.splice(currentIndex - 1, 0, newGame);
                await msg.edit(`Created channel ${c} of id : ${c.id}, index : ${currentIndex} , with permissions ${perms} for users ${message.author} and ${message.mentions.users.first()}`)

               startQuiz(c);
            });
            //channel create end
            

        } catch (error) {
            console.error(error);
            msg.edit(`${error.message}`);
        }

        //----------------------Tru catch end------------------------------------------------------

    },

};

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
