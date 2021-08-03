const tmi = require('tmi.js')
const { readdir } = require("fs/promises")

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
                username: "artemka64395", // For some reason tmi.js asks for bot username, but you literally can write anything in here and bot still will work (Just be sure there is anything in here)
                password: client.config.twitchBotToken
            },
            channels: [ client.config.twitchChannelName ]
        });

        const commands = await readdir(process.cwd()+'//commands', {withFileTypes: true}) || []
        commands.forEach(async f => {
            if (f.name.endsWith('.js')) return client.loadCommand(process.cwd()+'//commands//'+f.name)
            if (f.isDirectory()) await readdir(process.cwd()+'//commands//'+f.name).then(folderFile => folderFile.forEach(e => { // This piece of code is poorly written for my opinion. Too bad!
                if (e.endsWith('.js')) client.loadCommand(process.cwd()+'//commands//'+f.name+'//'+e)
            }))
        })

        const events = await readdir(__dirname+'/../eventsTwitch')
        events.forEach(f => {
            if (!f.endsWith(".js")) return
            const event = require(`../eventsTwitch/${f}`)
            let eventName = f.split(".")[0]
            twitch.on(eventName, event.bind(null, client))
        })

        await twitch.connect()

        return twitch
    } catch (e) {
        client.logger.error(client.interface.twitch.error)
        client.logger.error(e)
        return false
    }

}