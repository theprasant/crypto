const { getVal } = require('../../libs/decorator/getVal');
const fetch = require('node-fetch');

const remindPrice = async (client) => {
    try {
        const priceData = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=MoNero&vs_currencies=usd%2Cbtc&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true').then(res => res.json());
        let sendChannel = await client.channels.fetch('897359826571644938')
        let editMsg = await sendChannel.messages.fetch('897495262421991444')
        editMsg.edit(`\`\`\`json\n${JSON.stringify(priceData, null, 2)}\n\`\`\`\n> Updated at ${new Date().toLocaleString()}`)
        let count70, count60, count50 = 0;
        if (count70 < 1 && priceData['monero']['usd'] <= 270) {
            sendChannel.send(`Hey <@745688196440129915> xmr price is bellow **270**`);
            count70++;
        }
        if (count70 >= 1 && priceData['monero']['usd'] >= 270) {
            sendChannel.send(`Hey <@745688196440129915> xmr price is again above **270**`);
            count70 = 0;
        }

        if (count60 < 1 && priceData['monero']['usd'] <= 260) {
            sendChannel.send(`Hey <@745688196440129915> xmr price is bellow **260**`);
            count60++;
        }
        if (count60 > 1 && priceData['monero']['usd'] >= 260) {
            sendChannel.send(`Hey <@745688196440129915> xmr price is again above **260**`);
            count60 = 0;
        }

        if (count50 < 1 && priceData['monero']['usd'] <= 250) {
            sendChannel.send(`Hey <@745688196440129915> xmr price is bellow **250**`);
            count50++;
        }
        if (count50 > 1 && priceData['monero']['usd'] >= 250) {
            sendChannel.send(`Hey <@745688196440129915> xmr price is again above**250**`);
            count50 = 0;
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = { remindPrice };