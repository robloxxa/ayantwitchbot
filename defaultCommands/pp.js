exports.conf = {
    name: 'pp',
    aliases: [],
    modOnly: false
}

exports.run = async (client, channel, author, value) => {
    const data = await client.gosu.data()
    if (!data) return
    if (value.length < 1) return client.twitch.say(`@${author.username}, ${data.menu.pp["100"].round(2)}pp for 100% 0miss`)
    const map = await client.ojsama.parse(data, value)
    if (!map) return
    client.twitch.say(channel, `@${author.username}, ${map.total} for ${map.acc} ${map.combo} ${map.miss} ${map.mods}`)
}
