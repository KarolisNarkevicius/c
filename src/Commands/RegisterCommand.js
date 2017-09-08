const Cache = require('./../Cache');
const fs = require('fs');

class RegisterCommand {

	constructor() {
		this.command = "register";
		this.description = "Registers commands to `c` cache";
		this.options = {
			
		};
	}

	handle() {

		let path = process.cwd();

		let files = this.getCommandFiles(
			fs.readdirSync(path)
		);

		files.forEach(function(file) {

			let filepath = path + '/' + file; 
			let instance =  new (require(filepath))();
			if (instance.command && typeof instance.handle === 'function') {

				if (!Cache.get('commands.'+instance.command)) {

					Cache.set('commands.'+instance.command, filepath);
					console.log('Added ' + instance.command + ' command.');

				} else {
					console.log(instance.command + ' already in cache.');
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

module.exports = RegisterCommand;