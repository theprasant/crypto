const { prefix, tipccId, devModeAccess } = require('../config.json');
const {niceDate, niceTime, getRoundTime} = require('../libs/decorator/timeDecorator')
const {checkTipcc} = require('../libs/tipcc/tipcc');

module.exports = {
    name: 'messageCreate',
    async execute(message) {

        // const command = message.client.commands.get(message.commandName);
        try {
            if(message.author.bot && message.author.id != tipccId) return;
            if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return checkTipcc(message);;

            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = message.client.commands.get(commandName);
                // message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command){
                return;
            //   checkTipcc(message);
            };

            if(command.inDevMode && !devModeAccess.includes(message.author.id)) return;
            
            if (command.args && !args.length) {
                let reply = `You didn't provide any arguments, ${message.author}!`;
            
                if (command.usage) {
                  reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
                }
            
                return message.channel.send(reply);
              }
            
           
            await command.execute(message, args, commandName, message.client);
        } catch (error) {
            console.error(error);
            await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};