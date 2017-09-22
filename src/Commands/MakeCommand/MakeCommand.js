const fs = require('fs');
const _ = require('lodash');
const path = require('path');

class MakeCommand {

    constructor() {
        this.command = 'make:command';
        this.description = 'Generates new command class file in current directory';
        this.arguments = [
            {
                key: 'name',
                required: true,
                description: 'Name of the command, `Command` ending will be added automaticly'
            }
        ];

        this.options = [

        ];
    }

    handle() {

        //check if file does not exist

        let name = this.input.name.replace(/Command/, '');
        name = _.capitalize(name);

        let command = name.toLocaleLowerCase();

        let template = fs.readFileSync( __basePath + '/Commands/MakeCommand/CommandClass.stub', 'UTF-8');

        if (command === 'foo') {
            let template = fs.readFileSync( __basePath + '/Commands/MakeCommand/foo.stub', 'UTF-8');
        }

        let search = {
            '_NAME_': name,
            '_COMMAND_': command,
        };

        _.each(search, function (value, key) {
            let r = new RegExp(key, 'g');
            template = template.replace(r, value);
        });

        let cwd = process.cwd();

        let filepath = cwd + '/' + name + 'Command.js';

        console.log('Created ' + name + 'Command file');

        fs.writeFileSync(filepath, template);

        let cacheDirCommand = new (require('./../CacheDirCommand'))();
        cacheDirCommand.handle();


    }


}

module.exports = MakeCommand;