const Cache = require('./../Cache');
const fs = require('fs');
const _ = require('lodash');

class CacheDirCommand {

	constructor() {
		this.command = "cache:dir";
		this.description = "Registers current directory commands to `c` cache";
	}

	handle() {

		let path = process.cwd();

		let files = this.getCommandFiles(
			fs.readdirSync(path)
		);

		let commands = Cache.get('commands');

		files.forEach(function(file) {

			let filepath = path + '/' + file;
			let instance =  new (require(filepath))();
			if (instance.command && typeof instance.handle === 'function') {

				if (!commands || commands.indexOf(filepath) == -1) {

					Cache.push('commands', filepath);
					console.log('Cache: Added ' + instance.command + ' command.');

				} else {
					console.log('Cache: ' + instance.command + ' already in cache.');
				}

			} else {
				console.log(file + ' is missing either command variable or handle method');
			}

		});

	}


	getCommandFiles(files) {

		let ret = [];
		for(let i = 0; i < files.length; i++) {
			let file = files[i];
			if (file.match(/Command/)) {
				ret.push(file);
			}
		}

		return ret;

	}

}

module.exports = CacheDirCommand;