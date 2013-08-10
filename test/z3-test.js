'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.Assertion.includeStack = true;

var EOL = require('os').EOL;

var Z3 = require('../src/z3.js');

describe('z3 binding', function () {

    
    it('should load z3', function (done) {

        var z3 = new Z3();

        var problem = [
                '(declare-const a Int)',
                '(declare-fun f (Int Bool) Int)',
                '(assert (> a 10))',
                '(assert (< (f a true) 100))',
                '(check-sat)'
            ].join('');
        z3.write(problem, function (response) {
            expect(response).to.equal('sat' + EOL);
            z3.write('(get-model)', function (response) {
                expect(response.substr(0, 6)).to.equal('(model')
                z3.kill();
                done();
            });
        });
    });
});