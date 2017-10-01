## C

A global framework for creating cli commands

## Install
```bash
$ npm install -g c-global
```   
## Commands

   Just type in `c` in the console and it will list all available commands

## Creating a command
```bash
$ c make:command foo
```
This will create a new file `FooCommand` in current directory.
```bash
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
```
To execute the command just type `c foo` in the console.

##Describing arguments and options

```bash    
class MakeUserCommand {
    constructor() {
        this.command = "make:user";
        this.description = "My awesome description!";
        
        this.arguments = [
            {
                key: 'name',
                required: true,
                description: 'User name',
                default: 'John' //if default is set required is ignored 
            },
        ];
        
        this.options = [
            {
                key: '--lastname', 
                short: '-l', 
                default: 'Doe', //if default is set required is ignored 
                required:false, 
                description: 'Users last name',
            }
        ];
    }   
    
    handle() {
        
        // all input is held in this.input
        
        console.log(this.input.name);
        console.log(this.input.lastname);
        
    }
}
module.exports = MakeUserCommand;
```

##Passing options to command

The above command accepts one `lastname` option. There are multiple ways of passing it:
    
```bash
$ c make:user John --lastname Doe 
$ c make:user John --lastname=Doe 
$ c make:user John --lastname="Doe Doee" 
$ c make:user John -l Doe 
$ c make:user John -l=Doe 
$ c make:user John -l="Doe Doee" 
```    
    
It does not matter witch option you use, all of them will store the value into this.input.lastname variable

##List
To display the list of available commands just type `c` with no parameters. 
All commands are 'namespaced', when creating a command like `make:user` make will be
the namespace. It has no real purpose except for looking nice in list of commands.

##Cache

Using `c make:command <name>` command will create and automatically put the command to cache,
To cache the commands your self you can use `c cache:dir` comamand, it will cache all commands in 
the current directory. To remove commands that no longer exist use `c cache:clear` command.


##Tests
```bash
$ npm test
```