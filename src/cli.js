const Cache = require('./Cache');

class cli {

	constructor() {
		this.in = {};

		let input = process.argv;
		input.shift();
		input.shift();

		this.in.command = false;
		if (input.length > 0) {
			this.in.command = input.shift();
		}

		this.in.options = [];
		if (input.length > 0) {
			this.in.options = input;
		}

		this.registerDefaultCommands();
		this.registerFromCache();

		this.execute();

	}

	execute() {

		let file = this.commandFiles[this.in.command];

		if (!file) {
			console.log('Can\'t find command file');
			return;
		}

		let commandInstance = new (require(file))();

		if (typeof commandInstance.handle !== 'function') {
			console.log('Can\'t find handle method');
			return;
		}

		commandInstance.input = {};
		commandInstance.input.options = this.in.options;
		commandInstance.input.option = function(option) {
			if (commandInstance.input.options.indexOf(option) == -1) {
				return false;
			}
			return true;
		};


		commandInstance.handle();


	}	

	registerFromCache() {

		let files = Cache.get('commands');
		this.commandFiles = Object.assign(this.commandFiles ,files);

	}


	registerDefaultCommands() {
		this.commandFiles = {
			'register': __basePath + '/Commands/RegisterCommand.js',  
			'test': __basePath + '/Commands/TestCommand.js'
		}
	}


}

module.exports = new cli();