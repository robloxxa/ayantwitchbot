const axios = require('axios')
const { version } = require('./package.json')
const { writeFile , rename, readdir, rm } = require('fs/promises')
const path = require('path')
const { spawn } = require('child_process')
const semver = require('semver')
const chalk = require('chalk')
const prettyNotes = (body) => {
    return body
        .replace(/(?:\#\# )([a-zA-Z0-9 ]*)/g, chalk.cyan('$1'))
        .replace(/\\/g, ' ')
        .replace(/(\*)/g, chalk.cyan('$1'))
        .replace(/\>([\S ]*)/g, chalk.gray(' $1'))
        .replace(/`([a-zA-Z0-9*: ]*)`/g, chalk.yellow('$1'))
        .replace(/(?:\!\[([a-zA-Z0-9 ]*)\])\(([\S ]*)\)/g, '$2')
        .replace(/\*\*\*([a-zA-Z0-9 ]*)\*\*\*'/g, chalk.redBright('$1'))
}

module.exports = async (client) => {
    if (!process.argv.includes('CAXA')) return
    await rm(process.cwd()+'//ayanbot-old').catch(() => {})
    const tempDirPath = path.basename(path.join(__dirname+'/../'))
    const tempDirs = await readdir(__dirname + '/../../')
    for (const dir of tempDirs) {
        if (tempDirPath === dir) continue
        await rm(path.join(__dirname, '/../../', dir), { recursive: true })
    }
    client.logger.log('Checking for new updates')
    const release = await axios.get('https://api.github.com/repos/robloxxa/ayantwitchbot/releases/latest').catch(() => { return false })
    if (!release || release.data.message === 'Not Found' || !release.data.assets) return client.logger.log(`No response from github`)
    if (semver.satisfies(version, `>=${release.data.tag_name}`)) return client.logger.log('You have latest version ('+version+')'+prettyNotes(release.data.body))
    if (!client.config.autoUpdate) return client.logger.log('New update available (AutoUpdate is off)\n'+release.data.body)
    const type = (process.platform === 'win32') ? 'application/vnd.microsoft.portable-executable' : 'application/octet-stream'
    const asset = release.data.assets.find(e => e.content_type === type)
    client.logger.log('Downloading new update')
    const { data } = await axios.get(asset.browser_download_url,  { responseType: "arraybuffer" })
    await rename(client.execPath.split(' - ').pop(), 'ayanbot-old')
    await writeFile(process.cwd()+'\\'+asset.name, data)
    await spawn(process.cwd()+'\\'+asset.name, { detached: true, cwd: process.cwd(), shell: true })
    process.exit()
}