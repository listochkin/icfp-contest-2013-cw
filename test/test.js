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
var expr_eval = require('../src/expr_eval');

// tests for expr_size()
var tests_expr_size = {
	'(lambda (x_78631) (fold (shr1 (xor (shl1 (or (or (if0 (and x_78631 (shl1 (shl1 (and (shr16 (and (shr4 x_78631) x_78631)) x_78631)))) 0 x_78631) x_78631) 0)) 0)) 1 (lambda (x_78632 x_78633) (xor (shr4 x_78632) x_78633))))' : 30
};

// tests for expr_str()
var tests_expr_str = [
	'(lambda (x_78631) (fold (shr1 (xor (shl1 (or (or (if0 (and x_78631 (shl1 (shl1 (and (shr16 (and (shr4 x_78631) x_78631)) x_78631)))) 0 x_78631) x_78631) 0)) 0)) 1 (lambda (x_78632 x_78633) (xor (shr4 x_78632) x_78633))))'
];

// tests for expr_eval()
var tests_expr_eval = {
	// VERY simple tests
	'(lambda (x_1914) 0)' : { 0: 0, 1: 0},
	'(lambda (x_1914) 1)' : { 0: 1, 1: 1},
	// simple tests
	'(lambda (x_1914) (shl1 (shl1 x_1914)))' : {0: 0, 1 : 4, 3: 12}
};


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

	for (var item in tests_expr_eval) (function(formula, expecteds){

		for (var arg in expecteds) (function(arg, expected){

			it('should evaluate `' + formula + '` with arg ' + arg + ' to ' + expected, function(){
				expect(expr_eval(Lparse(formula), arg)).to.eql(expected);
			});
		})(arg, expecteds[arg]);

	})(item, tests_expr_eval[item]);

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