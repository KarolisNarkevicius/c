class TestCommand {
	
	constructor() {

		this.command = 'test';
		this.description = 'test command for testing creating `c` functionality';

		this.arguments = [
			{
				key: 'name',
				default: 'Joe', //if deafault is set required is ignored
				description: 'User name',
			},
			'kitas',
		];

		this.options = [
			{
				key: '--last',
				short: '-l',
				default: '1.0.0',
				required:false,
				description: 'Prints last name',
			}, 
			{
				key: '--model',
                short: '-m',
                default: 'Users',
                required:true,
                description: 'Sets user model'
			}
		];

	}

	handle() {

	    console.log(this.input);

	}

}

module.exports = TestCommand;