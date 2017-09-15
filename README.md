##C-GLOBAL

A global framework for creating cli commands

##Install

    npm install -g c-global
    
##Commands

   Just type in `c` in the console and it will list all available commands

##Creating a command
    c make:command foo

This will create a new file `FooCommand` in current directory.

    class FooCommand {
	    constructor() {
	        this.command = "foo";
	        this.description = "My awesome description!";
	    }
	    
	    handle() {
		    console.log('Hello world!');
	    }
	}
	module.exports = FooCommand;

To execute the command just type `c foo` in the console.


