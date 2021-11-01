module.exports = {
    name: 'gtn',
    description: 'Guess the number!',
    myChannelPerms:['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: false,
    execute(message, args) {
      let fromNum = 1, toNum = 100;
      let choosenNum = randomIntFromInterval(fromNum, toNum);
        if(args[0].toLowercase() == c){}
    },
  };

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }