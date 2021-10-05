const mongoose = require('mongoose');
const Trader = require('../../database/models/trader');
const { checkIfAny } = require('../../libs/decorator/checkAny')
const tokens = require('../../libs/currencies/currency.json')
const {prefix} = require('../../config.json')


module.exports = {
    name: 'selling',
    description: 'Add you Trade to the list.',
    myChannelPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: true,
    execute(message, args) {
        // console.log(args)

        // if(!args || !args.length) return message.channel.send(`No argument provided`);

        let action = args.shift();

        // console.log(`action: ${action} \n args: ${args.length}`);

        if (!action || !action.length || !/add|remove|--list/i.test(action)) return message.channel.send(`No action provided\n> You have to specify whether you want to add or remove token from your selling list \n syntax: \`${prefix}selling <add|remove|--list> <tokens seprated by commas>\``);

        if(action && action.toLowerCase() == '--list') {
            Trader.findById(message.author.id, function (err, u) {
                //handling mongo error
                if (err) return console.error(err);

                if (u == null || !u.selling || !u.selling.length) return message.channel.send(`You have not added your trading offer. Use \`${prefix}selling add <tokens>\` or  \`${prefix}buying add <tokens>\` to add.`);
                try{
                    let tradeList = `
                   >  __${message.author.tag}__\n**Selling** : \`${u.selling.join('\`, \`')}\`
                    `
                    return message.channel.send(tradeList);
                }catch(err){
                    console.error(err);
                }
            });
            return;
        }

        if (!args || !args.length) return message.channel.send(`No Token provided\n> You have to specify which coin/token do you want to add or remove token from your selling list \n syntax: \`${prefix}selling <add|remove|--list> <tokens seprated by commas>\``)

        let tokenArr = args.join(' ').split(',').map(t => {
            return t.trim();
        });

        if (!tokenArr || !tokenArr.length) return message.channel.send(`No token provided\n> You have to provide the token names \n syntax: \`${prefix}selling <add|remove|--list> <tokens seprated by commas>\``);

        for (let i = 0; i < tokenArr.length; i++) {
            if (!checkIfAny(tokenArr[i], tokens)) return message.channel.send(`Token \`${tokenArr[i]}\` is not supported`);
        }

        //Checking if user already exists or not
        Trader.findById(message.author.id, function (err, u) {
            if (err) return console.error(err);
            if (u !== null) {

                if (action && action.toLowerCase() == 'add') {
                    let prevSelling = u.selling;
                    u.selling = [...new Set([...prevSelling, ...tokenArr])];
                } else if (action && action.toLowerCase() == 'remove') {
                    let prevSelling = u.selling;

                    prevSelling.forEach(e => {
                        if(tokenArr.some(x => x.toLowerCase() == e.toLowerCase())){
                            prevSelling.splice(prevSelling.indexOf(e), 1);
                        }
                    });

                    u.selling = [...new Set([...prevSelling])];
                } else {
                    return message.channel.send(`You have to specify whether you want to add or remove \n syntax: \`${prefix}selling <add|remove|--list> <tokens seprated by commas>\``);
                }

                return u.save((err, u) => {
                    if (err) {
                        console.error(err);
                        message.channel.send('I apologize for the inconvenience. Some error occurred.');
                    }

                    // message.channel.send(`You are now selling : \`${u.selling&&u.selling.length?u.selling.join(', '):'nothing'}\` \n and buying: \`${u.buying&&u.buying.length?u.buying.join(', '):'nothing'}\``)
                    message.channel.send(`\`${tokenArr&&tokenArr.length?tokenArr.join('\` , \`'):'nothing'}\` ${tokenArr&&tokenArr.length>=2?'have':'has'} been ${action=='add'?'added to':'removed from'} your selling list.`)
                });

            };

            // Creating a new trader

            // console.log(tokenArr);
            if (!args || !args.length) return message.channel.send(`Sorry you have to provide the Tokens/coins name\n> You have to specify whether you want to sell or buy \n syntax: \`${prefix}selling <add|remove> <tokens seprated by commas>\``);

            let sellingArr, buyingArr;

            if (action && action.toLowerCase() == 'add') {
                sellingArr = tokenArr;
            } else if (action && action.toLowerCase() == 'remove') {
                // buyingArr = tokenArr;
                return message.channel.send(`Sorry, what are you trying to remove? You have added noting yet.`)
            } else {
                return message.channel.send(`You have to specify whether you want to add or remove token \n syntax: \`${prefix}selling <add|remove> <tokens seprated by commas>\``);
            }

            const testTrader = new Trader({
                _id: message.author.id,
                selling: sellingArr,
                buying: buyingArr
            });

            testTrader.save((err, u) => {
                if (err) return console.error(err);
                // message.channel.send(`New user saved with selling: ${u.selling} \nbuying: ${u.buying}\nid: ${u._id}`);
                message.channel.send(`\`${u.selling&&u.selling.length?u.selling.join('\`, \`'):'nothing'}\` ${u.selling&&u.selling.length>=2?'have':'has'} been added to your selling list.`)

                // testUser.speak(message, message.author);
            });


        });


    },
};