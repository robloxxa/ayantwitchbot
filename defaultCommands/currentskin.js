exports.conf = {
    name: 'currentskin',
    aliases: ['skincurrent', 'skin'],
    modOnly: false,
    regexp: {
        only: false, // Set this to true if you don't wanna user call command within its name
        value: /skin\?/gi
    }
}

exports.run = async (client, channel, author, value) => {
    const data = await client.gosu.data() // fetching data from gosumemory (./api/gosu.js)
    if (!data) return // If no data received we just exit
    client.twitch.say(channel, `Current skin: ${data.settings.folders.skin}`)
}