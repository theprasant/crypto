const mongoose = require('mongoose');
const Trader = require('../../database/models/trader');
const {getPairFromAny} = require('../../libs/decorator/getPair');
const tokens = require('../../libs/currencies/currency.json')

// console.log(tokens)

module.exports = {
    name: 'buy',
    description: 'buy crypto.',
    myChannelPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: false,
    async execute(message, args) {

        // try{
        //     const tks = JSON.stringify(tokens, null, 4);
        //     fs.writeFileSync('curr.json', tks , 'utf-8')
        // }catch(err){
        //     console.error(err);
        // }
        if(!args || !args.length) return message.channel.send('Sorry you have to provide wht to search');

        // if(!tokens[args[0]]) return message.channel.send(`Sorry ${args[0]}is not supported`);

        let queryToken = getPairFromAny(args.join(' '), tokens)
        if(!queryToken) return message.channel.send(`Not supported`)

        let formatedQueryToken = queryToken .replace( /\\/g ,'\\\\')
                                                         .replace( /\./g,'\\.')
                                                         .replace( /\*g/ ,'\*')
                                                         .replace( /\^/g ,'\^')
                                                         .replace( /\$/g ,'\$')
                                                        .replace( /\(/g ,'\\(')
                                                        .replace( /\)/g ,'\\)')
                                                        .replace( /\[/g ,'\[')
                                                        .replace( /\]/g ,'\]');
        let tokenReg = new RegExp('^'+formatedQueryToken+'$', 'ig')
        const trader = await Trader.find({selling: tokenReg});
        // console.log(trader)
        let trTxt = JSON.stringify(trader, null, 2)
        message.channel.send(`\`\`\`json\n${trTxt}\n\`\`\``)
        console.log(`formatedQueryToken : ${formatedQueryToken} , tokenReg : ${tokenReg}`)

    },
};