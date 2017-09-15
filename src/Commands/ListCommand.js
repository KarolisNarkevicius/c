const _ = require('lodash');
const fs = require('fs');
const chalk = require('chalk');

class ListCommand {

    constructor() {

        this.command = "list";
        this.description = "Lists all available commands";


        this.commandFiles; //injected in cli.js on init

        this.defaultParent = '$_PARENT_$';
        this.defaultHeading = 'available commands';

        this.maxLength = 0;
        this.sapceBetween = 2;

    }

    handle() {

    	let sort = {};
    	//sort out commands by key - default is commands

    	//make a sort array where key is the heading of command and value is command key and description
    	_.each(this.commandFiles, function(filepath) {

    		if (!fs.existsSync(filepath)) {
    			return;
    		}

    		let instance = new (require(filepath))();

    		let key = instance.command;

    		if (key.length > this.maxLength) {
    			this.maxLength = key.length;
    		}

    		let split = key.split(':');
    		let parent;
    		let command;

	    	if (split.length > 1) {

	    		parent = split[0];
	    		command = split.join(':');

    		} else {

    			parent = this.defaultParent;
    			command = key;

    		}

    		if (!sort[parent]) {
    			sort[parent] = [];
    		}


    		sort[parent].push({
    			command,
    			description : instance.description
    		});

    	}.bind(this));

    	//extract headings and sort them so that this.defaultParent will be the first heading
    	let keys = _.keys(sort);
    	keys = keys.sort();
    	if (sort[this.defaultParent]) {
	    	keys = _.without(keys, this.defaultParent);
	    	keys = _.reverse(keys);
	    	keys.push(this.defaultParent);
	    	keys = _.reverse(keys);
    	}

    	//print out headings and comands with descriptions
    	console.log('');
    	_.each(keys, function(key) {

    		if (key == this.defaultParent) {
    			this.heading(this.defaultHeading);
    		} else {
    			this.heading(key);
    		}

    		_.each(sort[key], function(command) {

    			console.log('  ' + chalk.green(command.command)  + this.spacing(command.command) + chalk.white(command.description));

    		}.bind(this));	

    	}.bind(this));


    }

    heading(text, spacing=1) {
    	text = _.capitalize(text);
    	console.log(' '.repeat(spacing) + chalk.yellow(text));
    }

    spacing(command) {

    	let spaceNeeded = this.maxLength + this.sapceBetween;

    	let spaceCount = spaceNeeded - command.length;

    	let space = ' ';

    	return space.repeat(spaceCount);

    }

    line() {

    	//console.log()

    }


}

module.exports = ListCommand;