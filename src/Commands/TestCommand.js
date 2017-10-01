class TestCommand {

    constructor() {

        this.command = 'test';
        this.description = 'test command for testing creating `c` functionality';

        this.arguments = [
            'name',
            'lastname'
        ];

        this.options = [
            {
                key: '--fullname',
                short: '-f',
            },
            {
                key: '--name',
                short: '-n',
            },
        ];

    }

    handle() {

        if (this.input.fullname && this.input.name && this.input.lastname) {
            console.log(this.input.name + ' ' + this.input.lastname);
            return;
        }

        if (this.input.lastname) {
            console.log(this.input.lastname);
            return;
        }

        if (this.input.name) {
            console.log(this.input.name);
            return;
        }

        console.log('test');

    }

}

module.exports = TestCommand;