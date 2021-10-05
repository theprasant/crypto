const mongoose = require('mongoose');

const traderSchema = new mongoose.Schema({
    _id: String,
    selling: [String],
    buying:  [String]
  });

  traderSchema.methods.speak = function (message, user) {
    const greeting = `\n> Name: **${user?user.username:"None"}**\n> id: **${this._id?this.id:"None"}**\n> sparks: ${this.sparks?this.sparks:"None"}\n> badges: ${this.badges?this.badges:"None"}\n> stars: ${this.stars?this.stars:"None"} `
     
    message.channel.send(greeting)
  }

  //const dUsers = mongoose.model('Users', userSchema);

  module.exports = mongoose.models.Trader || mongoose.model('Trader', traderSchema);