const fetch = require('node-fetch')

module.exports = async (client) => {
    const release = await fetch('https://api.github.com/repos/robloxxa/ayantwitchbot/releases/latest').then(res => res.json())
    console.log(release)
}