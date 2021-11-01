const mongoose = require('mongoose');
const Trader = require('../../database/models/trader');
const { checkIfAny } = require('../../libs/decorator/checkAny')
const tokens = require('../../libs/currencies/currency.json')
const {prefix} = require('../../config.json')

module.exports = {
    name: 'priceremind',
    aliases: ['pr'],
    description: 'Remind price!',
    myChannelPerms:['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: false,
    execute(message) {
      message.channel.send('Pong. 🎉');
    },
  };