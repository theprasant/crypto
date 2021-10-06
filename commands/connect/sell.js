const mongoose = require('mongoose');
const Trader = require('../../database/models/trader');
const { getPairFromAny } = require('../../libs/decorator/getPair');
const { checkIfAny } = require('../../libs/decorator/checkAny');
const tokens = require('../../libs/currencies/currency.json');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { cleanRegex } = require('../../libs/decorator/regexCleaner');
const { prefix } = require('../../config.json')

module.exports = {
    name: 'sell',
    description: 'sell your crypto.',
    myChannelPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    // cooldown: 35,
    args: true,
    async execute(message, args) {

        let msg = await message.channel.send(`<a:gsearchgif:894799755278958602> Making a pizza ...`)
        let tokenArr = args.join(' ').split(',').map(t => {
            return t.trim();
        });
        if (!tokenArr || !tokenArr.length) return msg.edit(`No token provided\n> You have to provide the token names \n syntax: \`${prefix}sell <tokens seprated by commas>\``);

        let coinsForSearch = [];
        let notSupportedTokens2 = [];
        for (let i = 0; i < tokenArr.length; i++) {
            let queryToken = getPairFromAny(tokenArr[i], tokens);
            if (queryToken) {
                coinsForSearch.push(queryToken);
            } else {
                notSupportedTokens2.push(tokenArr[i]);
            }
        }

        if (notSupportedTokens2.length) return msg.edit(`\`${notSupportedTokens2.join('\` , \`')}\` ${notSupportedTokens2 && notSupportedTokens2.length >= 2 ? 'are' : 'is'} not supported`)
        if (!coinsForSearch.length) return msg.edit(`No supported coins or tokens provided`)

        let coinsForSearchStr = coinsForSearch.join('|');

        let formatedQueryToken = cleanRegex(coinsForSearchStr);
        let tokenReg = new RegExp('^' + formatedQueryToken + '$', 'ig')
        const trader = await Trader.find({ buying: tokenReg });
        if(!trader||!trader.length) return msg.edit(`No buyer found !`)

        const tradersEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('People to whom you can sell ')
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, `${message.author.avatarURL()}`, `${message.author.avatarURL()}`);

        for (let i = 0; i < trader.length; i++) {
            let tUser = await message.client.users.fetch(trader[i]._id);
            // tradersEmbed.addField(`${tUser.tag}`, `${tUser} : \`${trader[i].buying.join('\`, \`')}\``);
            tradersEmbed.addField(`${tUser.tag}`, `${tUser} : \`${trader[i].buying.join(', ')}\``);
            if (i > 9) break;
        }

        // await msg.edit({ content: `People buying  ${tokenArr.join(', ')}`, embeds: [tradersEmbed] })
        await msg.edit({ content: `People buying  ${tokenArr.join(', ')}`, embeds: [tradersEmbed] })

    },
};











        // const row = new MessageActionRow()
        //     .addComponents(
        //         new MessageButton()
        //             .setCustomId('primary')
        //             .setLabel('Primary')
        //             .setStyle('PRIMARY')
        //             .setEmoji('🎉'),
        //     );
        // tradersEmbed.setDescription(`${message.author}`)