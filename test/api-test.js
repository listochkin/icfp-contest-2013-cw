'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.Assertion.includeStack = true;

var api = require('../src/api.js');
var problems = null;

var _ = require('underscore'),
    fs = require('fs'), path = require('path');

var problemsFile = path.join(__dirname, '../problems.json');

describe('ICFP cloudapp.net endpoint', function () {

    before(function (done) {
        fs.exists(problemsFile, function (exists) {
            if (!exists) {
                api.problems(function (body) {
                    problems = _.sortBy(JSON.parse(body), function (p) {
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

    it('should load problems', function () {
        expect(problems.length).to.equal(1820);
        expect(problems[0].size).to.equal(3);
        expect(problems[problems.length - 1].size).to.equal(43);
    });

    it('should read train files', function () {
        var train = require('../src/train-reader.js');
        var trainProblem = train(10, 5);
        expect(trainProblem.size).to.equal(10);
    });

    // it('should do guess', function (done) {
    //     api.guess('MIlL8xHKKLqZV28YCj6OvR4B', '(lambda (x_9462) (if0 (plus (not x_9462) 1) (shr1 x_9462) (not x_9462)))', function (body) {
    //         console.log(body);
    //         done();
    //     });
    // });

    // it('should throttle requests', function (done) {
    //     api.guess('MIlL8xHKKLqZV28YCj6OvR4B', '(lambda (x_9462) (if0 (plus (not x_9462) 1) (shr1 x_9462) (not x_9462)))', function (body) {
    //         console.log(body);
    //         api.guess('MIlL8xHKKLqZV28YCj6OvR4B', '(lambda (x_9462) (if0 (plus (not x_9462) 1) (shr1 x_9462) (not x_9462)))', function (body) {
    //             console.log(body);
    //             done();
    //         });
    //     });
    // });
});
