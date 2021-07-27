const modsReference = ['SO', 'EZ', 'NF', 'HD', 'HT', 'DT', 'HR', 'FL', 'PF', 'SD', 'RX', 'AP', 'AT', 'SV2', 'ScoreV2']
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
            const props = require(commandName);
            if (!props.conf) throw `Can't find conf parameters`
            if (!props.conf.name) throw `Cannot find conf.name`
            client.commands.set(props.conf.name, props);
            if (props.conf.aliases) props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.conf.name);
            });
            if (props.conf.regexp) client.regexp.set(props.conf.name, props.conf.regexp.value)
            return true;
        } catch (e) {
            client.logger.error(`Unable to load command ${commandName.split('//')[2]}`)
            client.logger.error(`${e} in ${commandName.split('//')[2]}`)
            return false;
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
            case 0: return 'WIP'
            case 1: return 'Not Submitted'
            case 2: return 'Unranked'
            case 3: return 'Approved'
            case 5: return 'Ranked'
            case 6: return 'Qualified'
            case 7: return 'Loved'
            default: return 'Unranked'
        }
    }
    Number.prototype.toTime = function(isSec) {
        const ms = isSec ? this * 1e3 : this,
            lm = ~(4 * !!isSec),  /* limit fraction */
            fmt = new Date(ms).toISOString().slice(11, lm);
        // if (ms >= 8.64e7) {  /* >= 24 hours */
        //     const parts = fmt.split(/:(?=\d{2}:)/);
        //     parts[0] -= -24 * (ms / 8.64e7 | 0);
        //     return parts.join(':');
        // }

        return fmt.startsWith('00') ? fmt.slice(3) : fmt
    }

}

