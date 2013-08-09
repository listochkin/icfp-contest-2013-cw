'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.Assertion.includeStack = true;

var api = require('../src/api.js');
var problems = null;

var _ = require('underscore'),
    fs = require('fs'), path = require('path');

var problemsFile = path.join(__dirname, '../problems.json');

before(function (done) {
    fs.exists(problemsFile, function (exists) {
        if (exists) {
            api.problems(function (body) {
                problems = _.sortBy(body, function (p) {
                    return p.size;
                });
                fs.writeFileSync(problemsFile, JSON.stringify(problems, null, '\t'));
                done();
            });
        } else {
            fs.readFile(problemsFile, function (err, data) {
                if (err) throw err;
                problems = JSON.parse(data);
                done();
            });
        }
    });
});

describe('ICFP cloudapp.net endpoint', function () {
    it('should load problems', function () {
        expect(problems.length).to.equal(1420);
        expect(problems[0].size).to.equal(3);
        expect(problems[problems.length - 1].size).to.equal(30);
    });

    it('should call train', function (done) {
        api.train(3, [], function (problem) {
            expect(problem.size).to.equal(3);
            done();
        });
    });
});