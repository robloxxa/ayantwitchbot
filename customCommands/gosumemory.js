// Simple script that outputs data from gosumemory by user key input

exports.conf = {
    name: 'gosumemory',
    aliases: [],
    modOnly: false
}

exports.run = async (client, channel, author, [value]) => {
    const data = await client.gosu.data()
    if (!data) return
    const getKey = (data, keys) => {
        if (keys[0] === 'settings') return 'private'
        if (data[keys[0]] === undefined) return undefined
        if (keys.length === 1) return data[keys[0]]
        return getKey(data[keys.shift()], keys)
    }
    const keyValue = getKey(data, value.split('.'))
    if (typeof keyValue === "object" || typeof keyValue === "undefined" || keyValue.constructor === Array) return client.twitch.say(channel, `@${author.username}, invalid key`)
    client.twitch.say(channel, `@${author.username}, ${value}: ${keyValue}`)
}