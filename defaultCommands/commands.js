// Simple command that outputs every command name in bot

exports.conf = {
    name: 'commands',
    modOnly: false,
    aliases: ['cmds']
}
exports.run = async (client, channel, author, value) => {
    let commands = []
    client.commands.forEach( e => commands.push((e.conf.regexp && e.conf.regexp.only) ? "*"+e.conf.name+"*" : client.config.prefix+e.conf.name))
    client.twitch.say(channel, commands.join(", "))
}