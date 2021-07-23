exports.conf = {
    name: 'np',
    aliases: ['np'],
    modOnly: false
}

exports.run = async (client, channel, author, value) => {
    const data = await client.gosu.data()
    console.log(data)
    if (!data) return client.twitch.say(channel, `Can't fetch data from streamer game`)
    const metadata = data.menu.bm.metadata
    const link = (data.menu.bm.id !== 0) ? `https://osu.ppy.sh/b/${data.menu.bm.id}` : `*no link*`
    client.twitch.say(channel,
        `[${client.getRankedStatus(data.menu.bm.rankedStatus)}] ${metadata.artist} - ${metadata.title} [${metadata.difficulty}] (by ${metadata.mapper}) ${link}`
    )
}
