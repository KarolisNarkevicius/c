const Cache = require('./Cache');
const _ = require('lodash');
const fs = require('fs');

const pvz = `make:controller UserController -r -m="User" --route="users" -k karolis -t karolis -p='kaz kakitas' -l='niekos' -k kazkas`;

//matches any option
const OPTION_ANY = /((\s|^)(--?(.|\w+)(=|\s)(\w+|('[A-Za-z0-9_ ]+')|("[A-Za-z0-9_ ]+"))))|(\s--?(\w+|.)(\s|$))/g;

//-r --resource
const OPTION_NO_VALUE = /(\s--?(\w+|.)(\s|$))/;

//-r value | --resource value | -r=value | --resource=value
const OPTION_WITH_VALUE_BASIC = /(\s--?(\w+|.)(=|\s)\w+)/;

//-r="value" | --resource="value" | -r "value" | --resource "value"
const OPTION_WITH_VALUE_QUOTE_DOUBLE = /(\s--?(\w+|.)(=|\s)("[A-Za-z0-9_ ]+"))/;
//same but with single quotes
const OPTION_WITH_VALUE_QUOTE_SINGLE = /(\s--?(\w+|.)(=|\s)('[A-Za-z0-9_ ]+'))/;

class cli {

    constructor() {

        this.in = {};
        this.commandInstance = null;

        let input = process.argv;
        input.shift();
        input.shift();

        this.in.command = false;
        if (input.length > 0) {
            this.in.command = input.shift();
        }

        this.in.options;
        if (input.length > 0) {
            this.in.options = input;
        }

        this.registerDefaultCommands();
        this.registerFromCache();

        this.execute();

    }

    execute() {

        if (!this.in.command) {
            this.in.command = 'list';
        }

        let file;

        _.each(this.commandFiles, function (path) {

            if (fs.existsSync(path)) {

                let instance = new (require(path))();

                if (this.in.command == instance.command) {
                    this.commandInstance = instance;
                    return false;
                }

            }

        }.bind(this));

        if (!this.commandInstance) {
            console.log('Can\'t find command file'); //cl
            return;
        }


        if (this.in.command == 'list') {
            this.commandInstance.commandFiles = this.commandFiles;
        }

        if (typeof this.commandInstance.handle !== 'function') {
            console.log('Can\'t find handle method'); //cl
            return;
        }

        this.commandInstance.input = {};

        this.parseInput();

        this.commandInstance.handle();


    }

    parseInput() {
        let optionsArray;
        let inputArguments = [];
        let optionsString = '';
        if (this.in.options) {
            //put all options to string

            for (let i = 0; i < this.in.options.length; i++) {
                let opt = this.in.options[i];
                if (opt.match(/=/)) {
                    let split = opt.split('=');
                    if (split[1].match(/\s/)) {
                        split[1] = '"' + split[1] + '"';
                    }
                    this.in.options[i] = split.join('=');
                } else if (opt.match(/\s/)) {
                    this.in.options[i] = '"' + opt + '"';
                }
            }

            optionsString = this.in.options.join(' ');

            //extract only options to array
            optionsArray = optionsString.match(OPTION_ANY);

            //set argument string
            inputArguments = optionsString.replace(OPTION_ANY, '').split(' ');

            //create option only string
            if (optionsArray) {
                optionsString = optionsArray.join(' ');
            }
        }

        this.parseArguments(inputArguments);

        this.parseOptions(optionsString);

    }

    parseOptions(optionsString) {

        if (!this.commandInstance.options) {
            return;
        }

        for (let i = 0; i < this.commandInstance.options.length; i++) {
            let commandOption = this.commandInstance.options[i];

            //generates the key with short version
            //--version | -v
            let key = '(' + commandOption.key;
            if (commandOption.short) {
                key += '|' + commandOption.short + ')';
            } else {
                key += ')';
            }

            //extract an option from options string OPTION_ANY CONSTANT
            let expression = '(\\s(' + key + '(=|\\s)(\\w+|(\'[A-Za-z0-9_ ]+\')|("[A-Za-z0-9_ ]+"))))|(\\s' + key + '(\\s|$))';
            let re = new RegExp(expression);
            let matches = optionsString.match(re);
            if (matches) {
                this.setOptionByType(commandOption, matches[0].trim());
            }

        }

    }


    setOptionByType(commandOption, match) {

        let newKey = commandOption.key.replace(/--/, '');
        let value;

        //check if value exists
        if (match.match(/(--?(\w+|.)$)/)) {
            this.commandInstance.input[newKey] = true;
            return;
        }

        if (match.match(/=/)) {
            value = match.split('=')[1].replace(/"/g, '');
            this.commandInstance.input[newKey] = value;
            return;
        }

        let key = commandOption.key;
        if (commandOption.short) {
            key += '|' + commandOption.short;
        }

        let matches = match.match(new RegExp(key + '\\s"(.+)"'));
        if (matches && matches[1]) {
            this.commandInstance.input[newKey] = matches[1];
            return;
        }

        matches = match.match(new RegExp(key + '\\s(.+)'));
        if (matches && matches[1]) {
            this.commandInstance.input[newKey] = matches[1];
            return;
        }


    }

    parseArguments(inputArguments) {
        if (!this.commandInstance.arguments) {
            return;
        }

        //set command instance input arguments
        for (let i = 0; i < inputArguments.length; i++) {
            //if there is no argument set in command object, just skip
            if (!this.commandInstance.arguments[i]) {
                continue;
            }

            let inputArgument = inputArguments[i];
            let commandArgument = this.commandInstance.arguments[i];

            this.checkCommandArgumentKey(this.commandInstance.arguments[i]);

            if (typeof commandArgument === 'string') {
                commandArgument = {
                    key: commandArgument
                };
            }

            this.commandInstance.input[commandArgument.key] = inputArgument;

        }

        //check if all required arguments are set
        for (let i = 0; i < this.commandInstance.arguments.length; i++) {
            let required = this.commandInstance.arguments[i].required;
            let key = this.commandInstance.arguments[i].key;
            let default_value = this.commandInstance.arguments[i].default;

            this.checkCommandArgumentKey(this.commandInstance.arguments[i]);

            //if default is set and input is not then set it to default
            if (default_value && !this.commandInstance.input[key]) {
                this.commandInstance.input[key] = default_value;
            }

            //if arg is required and input is not set exit
            if (required && !this.commandInstance.input[key]) {
                console.log('Argument `' + key + '` not found.'); //cl
                process.exit(0);
            }
        }

    }

    checkCommandArgumentKey(commandArgument) {
        //if command argument is string turn it into an object

        if (!commandArgument.key && typeof commandArgument !== 'string') {
            console.log('Command argument is missing a key.'); //cl
            process.exit(0);
        }
    }

    registerFromCache() {

        let files = Cache.get('commands');
        this.commandFiles = _.concat(this.commandFiles, files);

    }


    registerDefaultCommands() {
        this.commandFiles = [
            __basePath + '/Commands/ListCommand.js',
            __basePath + '/Commands/CacheDirCommand.js',
            __basePath + '/Commands/TestCommand.js',
            __basePath + '/Commands/MakeCommand/MakeCommand.js',
            __basePath + '/Commands/CacheClearCommand.js',
        ];
    }

}

module.exports = new cli();