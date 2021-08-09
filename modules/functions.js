const modsReference = ['SO', 'EZ', 'NF', 'HD', 'HT', 'DT', 'HR', 'FL', 'PF', 'SD', 'RX', 'AP', 'AT', 'SV2', 'ScoreV2']
const moment = require('moment')
module.exports = async (client) => {
    client.getByRegexp = (value) => {
        for (let [name, regex] of client.regexp) {
            if (value.match(new RegExp(regex))) {
                client.logger.debug('Regexp matched '+regex.toString())
                return name
            }
        }
        return false
    }
    client.loadCommand = (commandName) => {
        try {
            const props = require(commandName)
            if (props.init) props.init(client)
            if (!props.conf && !props.init) throw `Can't find conf parameters`
            if (!props.conf.name && !props.init) throw `Cannot find conf.name`
            client.commands.set(props.conf.name, props)
            if (props.conf.aliases) props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.conf.name)
            });
            if (props.conf.regexp && props.conf.regexp.value) client.regexp.set(props.conf.name, props.conf.regexp.value)
            client.logger.ready(`command ${commandName.split('//').pop()} loaded`)
            return true
        } catch (e) {
            client.logger.error(`Unable to load command ${commandName.split('//').pop()}`)
            client.logger.error(`${e} in ${commandName.split('//').pop()}`)
            return false
        }
    }

    client.parseMods = (mods = "") => {
        const modsArr = mods.toUpperCase().split(/(?:[^a-zA-Z_]*)?(..)/g)
        return modsReference.filter(e => modsArr.includes(e)).join("")
    }

    client.getApiRankedStatus = (rankedStatus) => {
        switch (rankedStatus) {
            case -2: return 'Unranked'
            case -1: return 'WIP'
            case 0: return 'Pending'
            case 1: return 'Ranked'
            case 2: return 'Approved'
            case 3: return 'Qualified'
            case 4: return 'Loved'
            default: return 'Unranked'
        }
    }
    client.getGosuRankedStatus = (rankedStatus) => {
        switch (rankedStatus) {
            case 1: return 'Not Submitted'
            case 2: return 'Unranked'
            case 4: return 'Ranked'
            case 5: return 'Approved'
            case 6: return 'Qualified'
            case 7: return 'Loved'
            default: return 'Unranked'
        }
    }
    Number.prototype.toTime = function() {
        return moment()
            .startOf('day')
            .seconds(this)
            .format((this < 3600) ? 'mm:ss' : 'H:mm:ss')
    }
    Number.prototype.round = function (d) {
       return Math.round(this * Math.pow(10, d)) / Math.pow(10, d)
    }
}

