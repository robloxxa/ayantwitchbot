exports.conf = {
    name: 'profile',
    aliases: [],
    modOnly: false,
    regexp: {
        only: true,
        value: /(?:http:\/\/|https:\/\/)?(?:osu|old)\.ppy\.sh\/(?:u|users)\/([a-zA-z0-9%-_]*)/gi
    }
}

exports.run = async (client, channel, author, value) => {
    try {
        if (value.length < 1) return
        const regexp = new RegExp(this.conf.regexp.value)
        const userid = regexp.exec(value.join(" "))[1].replace(/%20/g, " ")
        const userData = await client.bancho.osuApi.user.get(userid)
        if (!userData) return
        const topPlay = await client.bancho.osuApi.user.getBest(userid, 0, 1)
        const hpp = (userData.count300+userData.count100+userData.count50)/userData.playcount
        client.twitch.say(channel, `
        ${userData.username} |
        Rank: ${userData.ppRank},
        pp: ${Math.round(userData.ppRaw)},
        Top play: ${Math.round(topPlay[0].pp)}pp,
        Hits per Play: ${hpp.toFixed(1)}`
        )
    } catch (e) {
        client.logger.error('(profile.js)'+e)
    }
}