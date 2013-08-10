'use strict';

module.exports = solve;

// train -> generate template -> eval -> smt -> z3 ->

// unsat -> change template
// sat -> values -> generate program -> guess

// wrong -> z3 ->^
// right -> done

function solve(problem) {

    var constraints = [];
    templateLoop();

    function templateLoop(previousTemplate) {
        // we've done with a problem - end loop
        if (problem.correct || problem.expired) return;

        // new template
        var template = generateTemplate(previousTemplate, problem);

        if (constraints.length === 0) {
            // we got no known constraints, need to evaluate at least once
            evaluate(problem, newValues, function (constraint) {
                constraints.push(constraint);
                z3trySolve(template, constraints);
            });
        } else {
            // we got constraints form past passes, reuse them
            z3trySolve(template, constraints);
        }

    }
}

function z3trySolve(template, constraints) {
    var smt = smtFor(template, constraints);

    callZ3(smt, function (sat) {
        if (!sat) {
            // this template is not satisfiable, try the next one
            templateLoop(template);
        } else {
            callZ3('smt to get values', function (values) {
                // generate program based on values from z3
                var program = generateProgram(template, values);

                // and check it
                guess(program, function (correct, constraint) {
                    if (correct) {
                        // YES!
                        problem.correct = true;
                        z3done();
                        return;
                    } else {
                        // we got counter example, try to solve with it
                        constraints.push(constraint);
                        z3trySolve(template, constraints);
                    }
                });
            });
        }
    });
}
