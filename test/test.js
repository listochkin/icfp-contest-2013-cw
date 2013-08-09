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
var expr_solve = require('../src/expr_solve');
var train = require('../src/train-reader.js');

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
	'(lambda (x_1914) (shl1 (shl1 x_1914)))' : {0: 0, 1 : 4, 3: 12},
	// fold
	'(lambda (z) (fold 1 z (lambda (y x) (or (shl1 x) y))))' :
			{0: 0x0000000000000080, 1: 0x0000000000000180, 0x20: 0x0000000000002080},
	'(lambda (x_70371) (fold (shl1 (not (shr16 (or (shl1 (and (plus (if0 (and (shl1 (xor x_70371 x_70371)) 0) 1 x_70371) x_70371) x_70371)) 1)))) 1 (lambda (x_70372 x_70373) (xor (not x_70372) x_70373))))' :
			{0: 0, 1: 0, 10: 0, 1000: 0, 101212: 0, 0xFF10: 0x0000000000000002, 0x1000: 0},
};

// tests for expr_solce()
var tests_expr_solve = {
	// VERY simple tests
	'3' : {
		'tests' : [0, 1,  0xFF, 0xFFFFFF, 0xFF10100111, -1],
		'index' : [1, 2]
	}
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


	for (var idx in tests_expr_solve['3']['index']) (function(JSONTask){

		for (var arg in tests_expr_solve['3']['tests']) (function(arg, expected){

			it('should evaluate `' + JSONTask['challenge'] + '` with arg ' + arg + ' to ' + expected, function(){
				expect(expr_eval(expr_solve(JSONTask)['s_expr'], arg)).to.eql(expected);
			});
		})(tests_expr_solve['3']['tests'][arg], expr_eval(Lparse(JSONTask['challenge']), tests_expr_solve['3']['tests'][arg]));

	})(train(3, tests_expr_solve['3']['index'][idx]));


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