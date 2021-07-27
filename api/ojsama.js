const ojsama = require("ojsama");
const readline = require("readline");
const { readFile } = require('fs/promises')
module.exports = (client) => {
    const self = {
        parse: async (data = {}, options = []) => {
            const osuFile = await readFile(`${data.settings.folders.songs}\\${data.menu.bm.path.folder}\\${data.menu.bm.path.file}`, {encoding: 'utf-8'})
            if (!osuFile) return false
            const parser = new ojsama.parser().feed(osuFile)
            const map = parser.map
            let mods, acc, combo, miss
            options.forEach(e => {
                if (e.startsWith("+")) mods = ojsama.modbits.from_string(client.parseMods(e))
                else if (e.endsWith("%")) acc = parseFloat(e)
                else if (e.endsWith("x")) combo = parseInt(e)
                else if (e.endsWith("m") || e.endsWith("miss")) miss = parseInt(e)
            })
            const stars = new ojsama.diff().calc({map: map, mods: mods});
            const pp = ojsama.ppv2({
                stars: stars,
                combo: combo,
                miss: miss,
                acc: acc,
            });
            return {
                total: pp.total.toFixed(2).toString()+'pp',
                combo: (combo) ? combo+'x' : '',
                mods: (mods) ? '+'+ojsama.modbits.string(mods) : '',
                miss: (miss) ? miss+'miss' : '0miss',
                acc: (acc) ? acc+'%' : '100%'
            }
        }
    }
    return self

}