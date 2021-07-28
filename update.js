const fetch = require('node-fetch')
const { version } = require('./package.json')

module.exports = async (client) => {
    client.logger.log('Checking for new updates')
    const release = await fetch('https://api.github.com/repos/robloxxa/ayantwitchbot/releases/latest').then(res => res.json())
    if (release.tag === version) return client.logger.log('You have latest version ('+version+')')
    if (!release || release.message === 'Not Found') return client.logger.log(`No response from github`)
}