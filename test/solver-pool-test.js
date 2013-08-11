'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.Assertion.includeStack = true;

var os = require('os'),
    async = require('async'),
    _ = require('underscore');

var Solver = require('../src/solver.js');
var train = require('../src/train-reader.js');
var api = require('../src/api.js');
api.LOG_API_CALLS = true;

describe.skip('Pool of Solvers', function () {

    var problemSet = [], solverPool = [];

    before(function () {
        for (var size = 4; size < 8 ; size++) {
            problemSet[size] = []
            for (var index = 1; index < 7; index++) {
                problemSet[size].push(train(size, index));
            }
        }

        for (var i = 0; i < os.cpus().length; i++) {
            solverPool.push(new Solver());
        };
    })
    
    it('should prepare a problem set', function () {
        expect(problemSet.length).to.equal(8);
    });

    it('should create a solver pool', function () {
        expect(solverPool.length).to.be.gte(1);
    });

    it.only('solver from pool should solve problems in parallel', function (done) {

        function getProblem(complexity) {
            return function (cb) {
                api.train(complexity, [], function (problem) {
                    cb(null, problem);
                });
            };
        }

        async.parallel([
                getProblem(5),
                getProblem(12), 
                getProblem(8),
                getProblem(7)
            ], function (err, problems) {
            if (err) {
                console.log('Async error: ', err);
                return;
            }
            problems = _(problems).uniq(false, function (p) {
                return p.id;
            });
            console.log('Problems received: ', problems);

            async.parallel(problems.map(function (problem) {
                return function (cb) {
                    var solver = _.find(solverPool, function (s) {
                        return s.task == null;
                    });
                    solver.start(problem, function () {
                        console.log('Solved problem: ', solver.task);
                        solver.task = null;
                        cb(null, null);
                    });
                }
            }), function () {
                done();
            });
        });
    });

    after(function () {
        api.LOG_API_CALLS = false;
    })
});
