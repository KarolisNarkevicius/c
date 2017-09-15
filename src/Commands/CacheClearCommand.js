const Cache = require(__basePath + '/Cache');
const _ = require('lodash');
const fs = require('fs');

class CacheClearCommand {

    constructor() {

        this.command = "cache:clear";
        this.description = "Checks all cached command files and removes the ones that are missing";
        
    }

    handle() {

    	let commands = Cache.get('commands');

    	_.each(commands, function(command, key) {
    		if (!fs.existsSync(command)) {
    			Cache.remove('commands.' + key);
    			if (command != 'undefined') {
    				console.log('Removed `' + command + '` command from cache'); //cl
    			}
    		}
    	});

    }

}

module.exports = CacheClearCommand;