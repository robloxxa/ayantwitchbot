exports.conf = {
    name: 'osulink',
    aliases: [],
    modOnly: false,
    regexp: {
        only: true,
        value: /(?:http:\/\/|https:\/\/)?(?:osu|old)\.(?:gatari|ppy)\.(?:sh|pw)\/?(b|s|beatmapsets)\/(\d*)#?(?:osu|mania|taiko|catch)?\/?(\d*) ?\+?(\w*)/gi
    }
}

exports.run = async (client, channel, author, value) => {
    try {
        const regexp = new RegExp(this.conf.regexp.value)
        const link = regexp.exec(value.join(" "))
        const id = (link[1] === 'beatmapsets') ? link[3] : link[2]
        const beatmaps = await client.bancho.osuApi.beatmaps.getByBeatmapId(id)
        if (beatmaps.length < 1) return client.twitch.say(channel, 'Wrong beatmap id')
        const metadata = beatmaps[0]
        const rankedStatus = client.getApiRankedStatus(metadata.approved)
        const mods = (link[4].length > 1) ? '+'+client.parseMods(link[4]) : ''
        const time = metadata.totalLength.toTime(true)
        await client.bancho.say(
            `${author.username} > [https://osu.ppy.sh/b/${id} [${rankedStatus}] ${metadata.artist} - ${metadata.title} [${metadata.version}]${mods}] ${time}⏰ ${metadata.difficultyRating.toFixed(2)}✰ ${metadata.bpm.toFixed()}BPM`
        )
        return client.twitch.say(channel,
            `[${rankedStatus}] ${metadata.artist} - ${metadata.title} [${metadata.version}] ${mods} ${metadata.difficultyRating.toFixed(2)}✰ by ${metadata.creator} | request added`)
    } catch (e) {
        client.logger.error(e)
        return client.twitch.say('Something went wrong, request will not be send')
    }
}
