const mongoose = require('mongoose');
const Trader = require('../../database/models/trader');
const { checkIfAny } = require('../../libs/decorator/checkAny')
const tokens = require('../../libs/currencies/currency.json')
const {prefix} = require('../../config.json')


module.exports = {
    name: 'buying',
    description: 'Add you Trade to the list.',
    myChannelPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: true,
    execute(message, args) {
        // console.log(args)

        // if(!args || !args.length) return message.channel.send(`No argument provided`);

        let action = args.shift();

        // console.log(`action: ${action} \n args: ${args.length}`);

        if (!action || !action.length || !/add|remove|--list/i.test(action)) return message.channel.send(`No action provided\n> You have to specify whether you want to add or remove token from your buying list \n syntax: \`${prefix}buying <add|remove|--list> <tokens seprated by commas>\``);

        if(action && action.toLowerCase() == '--list') {
            Trader.findById(message.author.id, function (err, u) {
                //handling mongo error
                if (err) return console.error(err);

                if (u == null || !u.buying || !u.buying.length) return message.channel.send(`You have not added your trading offer. Use \`${prefix}buying add <tokens>\` or  \`${prefix}selling add <tokens>\` to add.`);
                try{
                    let tradeList = `
                   >  __${message.author.tag}__\n**Buying** : \`${u.buying.join('\`, \`')}\`
                    `
                    return message.channel.send(tradeList);
                }catch(err){
                    message.channel.send(`Sorry for the inconvenience, Some error occured.`);
                    console.error(err);
                }
            });
            return;
        }

        if (!args || !args.length) return message.channel.send(`No Token provided\n> You have to specify which coin/token do you want to add or remove token from your buying list \n syntax: \`${prefix}buying <add|remove|--list> <tokens seprated by commas>\``)

        let tokenArr = args.join(' ').split(',').map(t => {
            return t.trim();
        });

        if (!tokenArr || !tokenArr.length) return message.channel.send(`No token provided\n> You have to provide the token names \n syntax: \`${prefix}buying <add|remove|--list> <tokens seprated by commas>\``);
        // let sellingArr, buyingArr;

        // if(action && action.toLowerCase() == 'sell'){
        //     sellingArr = tokenArr;
        // }else  if(action && action.toLowerCase() == 'buy'){
        //     buyingArr = tokenArr;
        // }else{
        //     return message.channel.send(`You have to specify whether you want to sell or buy \n syntax: \`;addtrade <sell|buy> <tokens seprated by commas>\``);
        // }

        for (let i = 0; i < tokenArr.length; i++) {
            if (!checkIfAny(tokenArr[i], tokens)) return message.channel.send(`Token \`${tokenArr[i]}\` is not supported`);
        }

        //Checking if user already exists or not
        Trader.findById(message.author.id, function (err, u) {
            //handling mongo error
            if (err) return console.error(err);
            //if user exists
            if (u !== null) {

                if (action && action.toLowerCase() == 'add') {
                    let prevBuying = u.buying;
                    u.buying = [...new Set([...prevBuying, ...tokenArr])];
                } else if (action && action.toLowerCase() == 'remove') {
                    let prevBuying = u.buying;

                    prevBuying.forEach(e => {
                        // if(tokenArr.includes(e)){
                        if(tokenArr.some(x => x.toLowerCase() == e.toLowerCase())){
                            prevBuying.splice(prevBuying.indexOf(e), 1);
                        }
                    });

                    u.buying = [...new Set([...prevBuying])];
                } else {
                    return message.channel.send(`You have to specify whether you want to add or remove \n syntax: \`${prefix}buying <add|remove|--list> <tokens seprated by commas>\``);
                }

                return u.save((err, u) => {
                    if (err) {
                        console.error(err);
                        message.channel.send('I apologize for the inconvenience. Some error occurred.');
                    }

                    message.channel.send(`\`${tokenArr&&tokenArr.length?tokenArr.join('\` , \`'):'nothing'}\` ${tokenArr&&tokenArr.length>=2?'have':'has'} been ${action=='add'?'added to':'removed from'} your buying list.`)

                });

            };

            // Creating a new trader

            // console.log(tokenArr);
            if (!args || !args.length) return message.channel.send(`Sorry you have to provide the Tokens/coins name\n> You have to specify whether you want to sell or buy \n syntax: \`${prefix}buying <add|remove> <tokens seprated by commas>\``);

            let sellingArr, buyingArr;

            if (action && action.toLowerCase() == 'add') {
                buyingArr = tokenArr;
            } else if (action && action.toLowerCase() == 'remove') {
                // buyingArr = tokenArr;
                return message.channel.send(`Sorry, what are you trying to remove? You have added noting yet.`)
            } else {
                return message.channel.send(`You have to specify whether you want to add or remove token \n syntax: \`${prefix}buying <add|remove> <tokens seprated by commas>\``);
            }

            const testTrader = new Trader({
                _id: message.author.id,
                selling: sellingArr,
                buying: buyingArr
            });

            testTrader.save((err, u) => {
                if (err) return console.error(err);
                message.channel.send(`\`${u.buying&&u.buying.length?u.buying.join('\`, \`'):'nothing'}\` ${u.buying&&u.buying.length>=2?'have':'has'} been added to your buying list.`)
                // testUser.speak(message, message.author);
            });


        });


    },
};