const Owlbot = require('owlbot-js');
const owl = Owlbot(process.env.OWL_TOKEN);

module.exports = {
    name: 'wc',
    description: 'word chain game!',
    myChannelPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: false,
    execute(message) {
        const filter = m => /^[a-zA-Z]+$/.test(m.content);
        let intervalMs = 1500;

        const startGame = () => {
            const collector = message.channel.createMessageCollector({ filter, time: intervalMs });

            collector.on('collect', m => {
                message.channel.send(`Collected ${m.content}`);
            });

            collector.on('end', collected => {
                message.channel.send(`Collected ${collected.size} items`);
            });
            startGame();
        }
        startGame();
    },
};