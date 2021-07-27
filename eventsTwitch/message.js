module.exports = async (client, channel, author, message, self) => {
    if (self) return
    client.logger.debug(`${author.username}: ${message}`)
    const regexp = (message.indexOf(client.config.prefix) === 0) ? false : client.getByRegexp(message)
    if (message.indexOf(client.config.prefix) !== 0 && !regexp) return
    const args = (regexp) ? message.trim().split(/ +/g) : message.slice(client.config.prefix.length).trim().split(/ +/g)
    const command = (regexp) ? regexp : args.shift().toLowerCase()
    const cmd = client.commands.get(command) || client.commands.get(regexp) || client.commands.get(client.aliases.get(command));
    if (!cmd) return
    if ((cmd.conf.regexp && cmd.conf.regexp.only) && cmd.conf.name === args[0]) return
    cmd.run(client, channel, author, args)
}