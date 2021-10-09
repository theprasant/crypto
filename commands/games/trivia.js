const fetch = require('node-fetch');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'trivia',
    description: 'Trivia quize!',
    myChannelPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: false,
    async execute(message) {

        let msg;
        const startQuiz = async () => {
           if(!msg){
            msg = await message.channel.send(`<a:gsearchgif:894799755278958602> Making a pizza ...`);
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

            msg.edit({content: 'Here is your question.', embeds: [exampleEmbed] });
        }

        startQuiz();

    },
};

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
