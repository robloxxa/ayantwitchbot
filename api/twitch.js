const tmi = require('tmi.js');
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

module.exports = async client => {
    client.commands = new Map()
    client.aliases = new Map()
    client.regexp = new Map()

    try {
        const twitch = new tmi.Client({
            options: { debug: false },
            connection: {
                reconnect: true,
                secure: true
            },
            identity: {
                username: "lol", // For some reason tmi.js asks for bot username, but you literally can write anything in here and bot still will work (Just be sure there is anything in here)
                password: client.config.twitchBotToken
            },
            channels: [ client.config.twitchChannelName ]
        });

        await readdir(process.cwd()+'//commands')
            .then(files => files.forEach(f => {
                if (!f.endsWith(".js")) return
                if (client.loadCommand(process.cwd()+'//commands//'+f)) client.logger.ready(`custom command ${f} loaded`)
        })).catch(() => {})

        const commands = await readdir('./defaultCommands/')

        commands.forEach(f => {
            if (!f.endsWith(".js")) return
            if (client.commands.has(f.split('.')[0])) return client.logger.debug(`default command ${f} was overrided by custom command`)
            if (client.loadCommand(`../defaultCommands/${f}`)) client.logger.debug(`default command ${f} loaded`)
        })

        const events = await readdir('./eventsTwitch/')
        events.forEach(f => {
            if (!f.endsWith(".js")) return
            const event = require(`../eventsTwitch/${f}`)
            let eventName = f.split(".")[0]
            twitch.on(eventName, event.bind(null, client))
        })

        await twitch.connect()

        return twitch
    } catch (e) {
        client.logger.error(client.langauge.twitch.error)
        client.logger.error(e)
        return false
    }

}