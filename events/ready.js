const {remindPrice} = require('../modules/reminder/getPrice')
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		// global.currentGames
		setInterval(() => {
			remindPrice(client)
		}, 120000)
	},
};