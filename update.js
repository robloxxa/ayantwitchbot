const axios = require('axios')
const { version } = require('./package.json')
const { writeFile , rename, readdir, rm } = require('fs/promises')
const path = require('path')
const { spawn } = require('child_process')
module.exports = async (client) => {
    if (!process.argv.includes('CAXA')) return
    await rm('./ayanbot-old').catch(() => {})
    const tempDirPath = path.basename(path.join(__dirname+'/../'))
    const tempDirs = await readdir(__dirname + '/../../')
    for (const dir of tempDirs) {
        if (tempDirPath === dir) continue;
        await rm(path.join(__dirname, '/../../', dir), { recursive: true })
    }
    client.logger.log('Checking for new updates')
    const release = await axios.get('https://api.github.com/repos/robloxxa/ayantwitchbot/releases/latest')
    if (release.data.tag === version) return client.logger.log('You have latest version ('+version+')')
    if (!release.data || release.data.message === 'Not Found') return client.logger.log(`No response from github`)
    const type = (process.platform === 'win32') ? 'application/vnd.microsoft.portable-executable' : 'application/octet-stream'
    const asset = release.data.assets.find(e => e.content_type === type)
    client.logger.log('Download new update')
    const { data } = await axios.get(asset.browser_download_url,  { responseType: "arraybuffer" })
    await rename(process.title.split(' - ').pop(), 'ayanbot-old')
    await writeFile(process.cwd()+'\\'+asset.name, data)
    await spawn(process.cwd()+'\\'+asset.name, { detached: true, cwd: process.cwd(), shell: true })
    process.exit()
}