// This is an example for .init() use and require() a local file
// This command will output gosumemory data in discord rich presence
const DiscordRPC = require(__dirname+'\\discordrpc')
const Websocket = require(__dirname+'\\ws')
const updateRate = 1500

exports.conf = {
    name: 'discordrpc',
    modOnly: true,
    aliases: ['richpresence', 'drpc']
}

exports.init = async (client) => {
    const rpc = new DiscordRPC.Client({ transport: 'ipc' })
    const osu = new Websocket(`ws://localhost:${client.config.gosuPort}/ws`)
    client.discordrpc = { rpc, osu }
    rpc.on('ready', () => client.logger.log('Discord Rich Presence is Working'))
    rpc.on('error', (e) => client.logger.error('(DiscordRPC) '+e))
    await rpc.login({ clientId: '872837012061823056' })
    osu.on('error', (e) => {
        client.logger.error('(DiscordRPC) '+e)
        rpc.clearActivity(process.pid)
    })
    const uData = await client.bancho.getSelf().fetchFromAPI()
    const largeImageText = (uData) ? `${uData.username} | ${uData.ppRaw.toFixed(0)}pp | #${uData.ppRank}` : "Playing osu!"
    let lastUpdate = Date.now()
    osu.on('message', (incoming) => {
        let data = JSON.parse(incoming),
            bmstats
        if (Date.now() - lastUpdate < updateRate) return
        lastUpdate = Date.now()
        const presence = {
            largeImageKey: 'osu-logo',
            largeImageText: largeImageText,
            smallImageKey: "smoll",
            smallImageText: "SS",
            details: `${data.menu.bm.metadata.artist} - ${data.menu.bm.metadata.title} (by ${data.menu.bm.metadata.mapper})}`,
            state: `Just chilling`,
            buttons: []
        }
        switch (data.menu.state) {
            case 0: break
            case 1:
                presence.state = 'Editing a map'
                break
            case 2:
            case 7:
                let mods = (data.menu.mods.str) ? '+'+data.menu.mods.str : ""
                presence.state = (data.menu.state === 2) ? 'Playing a map '+mods: 'In Result Screen'
                bmstats = `AR:${data.menu.bm.stats.AR} CS:${data.menu.bm.stats.CS} OD:${data.menu.bm.stats.OD} HP:${data.menu.bm.stats.HP}`
                presence.smallImageKey = (data.gameplay.hits.grade.current) ? data.gameplay.hits.grade.current.toLowerCase() : 'n'
                presence.smallImageText = 'Rank: '+data.gameplay.hits.grade.current
                presence.startTimestamp = Date.now() - data.menu.bm.time.current;
                presence.endTimestamp = presence.startTimestamp + data.menu.bm.time.full
                presence.buttons.push({
                    label: `${data.gameplay.accuracy}% | ${data.gameplay.pp.current}pp | ${data.gameplay.hits[0]}xMiss`,
                    url: `https://github.com/robloxxa/ayantwitchbot`
                })
                break
            case 4:
            case 5:
            case 15: presence.state = 'In Songs Selection'
                break
            case 11:
            case 12: presence.state = 'In multiplayer'
                break
            case 19: presence.state = 'Updating Beatmaps'
                break
        }
        presence.buttons.push({
            label: (bmstats) ? bmstats : 'Beatmap Link',
            url: `https://osu.ppy.sh/b/${data.menu.bm.id}`
        })
        rpc.setActivity(presence)
    })
}
exports.run = async (client, channel, author, [onoff]) => {
    switch (onoff) {
        case 'off':
            if (!client.discordrpc) return client.twitch.say(channel, 'Discord Rich Presence is already off')
            client.discordrpc.osu.terminate()
            await client.discordrpc.rpc.destroy()
            client.discordrpc = null
            return client.twitch.say(channel, 'Discord Rich Presence is shutted down!')
        case 'on':
            if (client.discordrpc) return client.twitch.say(channel, 'Discord Rich Presence is already on')
            await this.init(client)
            return client.twitch.say(channel, 'Discord Rich Presence is turned on!')
    }
}

