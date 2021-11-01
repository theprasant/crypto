module.exports = {
    name: 'quiz',
    description: 'Ple gem !',
    myChannelPerms:['VIEW_CHANNEL', 'SEND_MESSAGES'],
    inDevMode: true,
    // cooldown: 35,
    args: false,
    execute(message) {
        const quiz = [
            {
                "question": "What color is the sky?",
                "answers": ["blue"]
            },
            {
                "question": "How many letters are there in the alphabet?",
                "answers": ["26", "twenty-six", "twenty six", "twentysix"]
            }
        ];
        // ...
        const item = quiz[Math.floor(Math.random() * quiz.length)];
        const filter = response => {
            return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
        };
        
        message.reply(item.question, { fetchReply: true })
            .then(() => {
                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        message.reply(`${collected.first().author} got the correct answer!`);
                    })
                    .catch(collected => {
                        message.reply(`Looks like no one answered it correctly`);
                        console.log(collected);
                    });
            });
    },
  };