var assert = require('assert');
const {execSync} = require('child_process');
const _ = require('lodash');

let command = 'node ' + __dirname + '/../index.js';
let testCommand = command + ' test';

describe('Command', function () {
    it('should execute', function () {
        let output = execSync(command);
        assert.ok(output.toString());
    });
});
describe('Test command', function () {
    it('should output "test"', function () {
        let output = execSync(testCommand);
        assert.equal(output.toString().trim(), 'test');
    });
});

//todo: should write tests with required option

let parameters = {
    'John': 'John',
    'John Doe': 'Doe',
    'John Doe --fullname': 'John Doe',
    'John Doe -f': 'John Doe',
    '--name="Johan Doer"': 'Johan Doer',
    '--name "Johan Doer"': 'Johan Doer',
    '--name=Johan': 'Johan',
    '--name Johan': 'Johan',
    '-n="Johan Doer"': 'Johan Doer',
    '-n "Johan Doer"': 'Johan Doer',
    '-n=Johan': 'Johan',
    '-n Johan': 'Johan',
};


describe('Test command arguments && options', function () {
    _.each(parameters, function (value, key) {
        it('c test ' + key + ' should output "' + value + '"', function () {
            let output = execSync(testCommand + ' '+key);
            assert.equal(output.toString().trim(), value);
        });
    });
});
