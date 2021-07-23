exports.conf = {
    name: 'osulink',
    aliases: [],
    modOnly: false,
    regexp: {
        only: true,
        value: /(?:http:\/\/|https:\/\/)?(?:osu|old).(?:gatari|ppy).(?:sh|pw)\/(?:b|s|beatmapsets)\/(\d*)#?(?:osu|mania|taiko|catch)?\/?(\d*)(?: |$|)/gi
    }
}

exports.run = async (client, channel, author, value) => {
    try {
        const joinedValue = value.join(" ")
        const regexp = new RegExp(this.conf.regexp.value)
        const link = regexp.exec(joinedValue)
        const id = (link[2].length > 0) ? link[2] : link[1]
        const beatmaps = await client.bancho.osuApi.beatmaps.getByBeatmapId(id)
        if (beatmaps.length < 1) return client.twitch.say('Wrong beatmap id')
        const metadata = beatmaps[0]
        const rankedStatus = metadata.approved // TODO: Need to make another function for parse rankedstatus like in !np command
        await client.bancho.say(
            `${author.username} > [${rankedStatus}] [https://osu.ppy.sh/b/${id} ${metadata.artist} - ${metadata.title} [${metadata.version}]] `
        )
        return client.twitch.say(channel,
            `[${rankedStatus}] ${metadata.artist} - ${metadata.title} [${metadata.version}] (by ${metadata.creator}) request added`)
    } catch (e) {
        client.logger.error(e)
        return client.twitch.say('Something went wrong, request will not be send')
    }

}
