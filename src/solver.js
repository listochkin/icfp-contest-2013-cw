
var api = require('../src/api.js');
var generator = require('../src/template-generator.js');
var translator = require('../src/translator.js');
var Z3 = require('../src/z3.js');
var async = require('async');

module.exports = Solver;

function Solver(task) {
    this.task = task;
    this.constraints = [];
    this.pendingConstraints = [];
    this.templateStatus;
    this.template;
    this.z3;
    this.z3Status;

    this.programHoles;
    this.program;

}

Solver.prototype.addConstraint = function (constraints) {
    this.constraints.push(constraints);
    this.pendingConstraints.push(constraints);
}

Solver.prototype.evaluate = function (inputs, callback) {
    api.evaluate(this.task.id, '', inputs, function(response) {
        var i;
        console.log('Eval: ' + response.status + ' Outpus: ' + response.outputs);

        pendingConstraints = [];
        for (i = 0; i < response.outputs.length; i += 1) {
            this.addConstraint([inputs[i], response.outputs[i]]);
        }
        callback(null);
    }.bind(this));
}

Solver.prototype.guess = function () {
    api.guess(task.id, program, function(response) {
        console.log(response.status);

        this.templateStatus = response.status;
        if (response.status === 'mismatch') {
            // add response.values to pending constraints
            this.pendingConstraints = [];
            this.addConstraint([response.values[0], response.values[1]]);
        }
    }.bind(this));
}

Solver.prototype.getZ3Problem = function() {
    var i;
    var problem = translator.translate_template(this.template, this.task.operators);
    for (i = 0; i < this.constraints.length; i += 1) {
        problem += translator.translate_constraint16(this.constraints[i][0], this.constraints[i][1]);
    }
    return problem;
}

Solver.prototype.askZ3 = function(problem, callback) {
    this.z3.write(problem, function (response) {
        console.log(response);
        if(response.indexOf('sat') != -1)
            z3.write('(get-model)', function (response) {
                console.log(response);

                this.programHoles = templateUtil.extractVariables(response);
                console.log(variables);
                this.program = templateUtil.toProgram(this.template, this.programHoles)
                console.log(this.program);
                callback(null);
            });
        else
            callback(null);
    }.bind(this));
}

Solver.prototype.getNextTemplate = function() {
    this.template = generator.next_program(this.task.size, this.template);
}

Solver.prototype.start = function() {

    var that = this;

    this.z3 = new Z3();
    this.getNextTemplate();

    async.series([
        function(callback) {
            that.evaluate(['0x0000000000000000', '0x0000000000000002'], callback);
        },
        function(callback) {
            var z3problem = that.getZ3Problem();
            that.askZ3(z3problem, callback);
        }
    ]);

}

Solver.prototype.stop = function() {
    this.z3.kill();
}