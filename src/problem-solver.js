'use strict';

module.exports = solve;

// train -> generate template -> eval -> smt -> z3 ->

// unsat -> change template
// sat -> values -> generate program -> guess

// wrong -> z3 ->^
// right -> done

var INITIAL_VALUES = ['0x0000000000000001', '0x0000000000000110', '0xFE5645A7867867B3'];

function solve(problem, done) {

    var constraints = [];
    templateLoop();

    function templateLoop(previousTemplate) {
        // we've done with a problem - end loop
        if (problem.correct || problem.expired) {
            done(problem);
            return;
        }

        // new template
        var template = generateTemplate(previousTemplate, problem);

        if (constraints.length === 0) {
            // we got no known constraints, need to evaluate at least once
            evaluate(problem, INITIAL_VALUES, function (newConstraints) {
                newConstraints.forEach(function (c) { constraints.push(c); });
                z3trySolve(problem, template, constraints);
            });
        } else {
            // we got constraints form past passes, reuse them
            z3trySolve(problem, template, constraints);
        }

    }
}

function z3trySolve(problem, template, constraints) {
    console.log('z3trySolve: ', arguments);
    var smt = smtFor(problem, template, constraints);

    callZ3(smt, function (z3response) {
        console.log('Z3 Response: ', z3response);
        if (!isSat(z3response)) {
            // this template is not satisfiable, try the next one
            templateLoop(template);
        } else {
            callZ3('(get-model)', function (z3response) {
                console.log('Z3 Response: ', z3response);
                var values = valuesFrom(z3response);
                // generate program based on values from z3
                var program = generateProgram(template, values);

                // and check it
                guess(problem, program, function (correct, newConstraints) {
                    if (correct) {
                        // YES!
                        problem.correct = true;
                        z3done();
                        return;
                    } else {
                        // we got counter example, try to solve with it
                        newConstraints.forEach(function (c) { constraints.push(c); });
                        z3trySolve(problem, template, constraints);
                    }
                });
            });
        }
    });
}

var api = require('../src/api.js');
var generator = require('../src/template-generator.js');
var translator = require('../src/translator.js');
var Z3 = require('../src/z3.js');
var templateUtil = require('../src/template-util.js');


function generateTemplate(previousTemplate, problem) {
    return generator.next_program(problem.size, previousTemplate);
}

function evaluate(problem, values, callback) {
    api.evaluate(problem.id, '', values, function(response) {
        console.log('Eval: ' + response.status + ' Outpus: ' + response.outputs);
        callback(response.outputs);
    });
}

function smtFor(problem, template, constraints) {
    var smt = translator.translate_template(template, problem.operators);
    for (var i = 0; i < constraints.length; i += 1) {
        smt += translator.translate_constraint16(constraints[i][0], constraints[i][1]);
    }
    return smt;
}

var z3 = new Z3();

function callZ3(smt, callback) {
    console.log('SMT: ', smt);
    z3.write(smt, callback);
}

function isSat(response) {
    return !!response.match(/^sat/) ? true : (!!response.match(/^unsat/) ? false : true);
}

function valuesFrom(response) {
    return templateUtil.extractVariables(response);
}

function generateProgram(template, values) {
    return templateUtil.toProgram(template, values);
}

function guess(problem, program, callback) {
    console.log('Calling guess with: ', problem, program);
    api.guess(problem.id, program.toString(), function(response) {
        console.log('Guess returned: ', response.status);
        var correct = response.status.indexOf('win') !== -1;
        callback(correct, [response.values]);
    });
}

function z3done() {
    z3.kill();
}
