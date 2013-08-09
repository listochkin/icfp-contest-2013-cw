'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.Assertion.includeStack = true;

// LISP
var Lparse = require('LISP.js').parse;

/*
 expr tests
*/
var expr_size = require('../src/expr_size');
var expr_str = require('../src/expr_str');

// tests for expr_size()
var tests_expr_size = {
	'(lambda (x_78631) (fold (shr1 (xor (shl1 (or (or (if0 (and x_78631 (shl1 (shl1 (and (shr16 (and (shr4 x_78631) x_78631)) x_78631)))) 0 x_78631) x_78631) 0)) 0)) 1 (lambda (x_78632 x_78633) (xor (shr4 x_78632) x_78633))))' : 30
};

// tests for expr_str()
var tests_expr_str = [
	'(lambda (x_78631) (fold (shr1 (xor (shl1 (or (or (if0 (and x_78631 (shl1 (shl1 (and (shr16 (and (shr4 x_78631) x_78631)) x_78631)))) 0 x_78631) x_78631) 0)) 0)) 1 (lambda (x_78632 x_78633) (xor (shr4 x_78632) x_78633))))'
];


/*
*/


describe('Here\'s how to write tests in Mocha', function () {

    beforeEach(function () {
    });

    it('should pass', function () {
        expect('Hello').to.equal('Hello');
    });
	
	for (var item in tests_expr_size) (function(arg, expected){

		it('should evaluate `' + arg + '` to ' + expected, function(){
			expect(expr_size(Lparse(arg))).to.eql(expected);
		});

	})(item, tests_expr_size[item]);

	for (var item in tests_expr_str) (function(arg, expected){

		it('should evaluate `' + arg + '` to ' + expected, function(){
			expect(expr_str(Lparse(arg))).to.eql(expected);
		});

	})(item, item);

    describe('Describe sections can be nested', function () {

        it('Should run async tests, too', function (done) {
            setTimeout(function () {
                expect('Hello').to.be.a('string');
                // call done when you're ready.
                done();
            }, 100);
        });

    });

    afterEach(function () {

    });
});