class TestCommand {
	
	constructor() {

		this.command = 'test';
		this.description = 'test command for testing creating `c` functionality';
		this.options = ['{user_id}', '-c', '--command=kazkas'];

	}

	handle() {

		console.log(this.input.option('{kazkas}'));
		console.log('Test command');

	}

}

module.exports = TestCommand;