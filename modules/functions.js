module.exports = async (client) => {
    client.getByRegexp = (value) => {
        for (let [name, regex] of client.regexp) {
            if (value.match(new RegExp(regex))) return name
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
    client.getRankedStatus = (rankedStatus) => {
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
}

