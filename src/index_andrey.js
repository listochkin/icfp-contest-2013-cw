'use strict';

var api = require('../src/api.js'),
    Solver = require('../src/solver.js');

api.LOG_API_CALLS = true;

function solveProblems(count, complexity) {
    var solver = new Solver();

    var problems = [];

    function callback() {
        console.log(problems);
    }

    (function loop() {
        if (problems.length === count) {
            api.queue.stop();
            callback();
            return;
        }
        api.train(complexity, [], function (problem) {
            problems.push(problem);
            solver.start(problem, function () {
                console.log('Solver status: ', solver.templateStatus);
                process.nextTick(loop);
            });
        })
    })();
}

solveProblems(1, 4);
