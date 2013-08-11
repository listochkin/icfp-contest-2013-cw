
var api = require('../src/api.js');
var generator = require('../src/template-generator.js');
var translator = require('../src/translator.js');
var Z3 = require('../src/z3.js');
var async = require('async');
var templateUtil = require('../src/template-util.js');
var expr_str = require('../src/expr_str');

module.exports = Solver;

function Solver(task) {
    this.task = task;
    this.constraints = [];
    this.pendingConstraints = [];
    this.templateStatus = 'mismatch';
    this.template;

    this.z3;
    this.z3program;
    this.z3sat = true;

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
        console.log('EVAL: ' + response.status + ', Outpus: ' + response.outputs);

        pendingConstraints = [];
        for (i = 0; i < response.outputs.length; i += 1) {
            this.addConstraint([inputs[i], response.outputs[i]]);
        }
        this.z3program += translator.translate_constraint16(this.constraints);
        this.z3program += translator.check_sat();
        callback(null);
    }.bind(this));
}

Solver.prototype.guess = function (callback) {

    if (!this.z3sat) {
        callback(null);
        return;
    }

    api.guess(this.task.id, expr_str(this.program), function(response) {
        console.log(response.status);

        this.templateStatus = response.status;

        if (response.status === 'mismatch') {
            // add response.values to pending constraints
            this.pendingConstraints = [];
            this.addConstraint([response.values[0], response.values[1]]);
            this.z3program += translator.translate_constraint16([[response.values[0], response.values[1]]]);
            this.z3program += translator.check_sat();
        }
        callback(null);
    }.bind(this));
}


Solver.prototype.callZ3 = function(callback) {
    console.log(this.z3program);
    this.z3.write(this.z3program, function (response) {
        console.log(response);
        if(response.indexOf('sat') == 0) {
            this.z3.write('(get-model)', function (response) {
                console.log(response);
                this.programHoles = templateUtil.extractVariables(response);
                console.log(this.programHoles);

                this.program = templateUtil.toProgram(this.template, this.programHoles, this.task.operators)
                console.log(expr_str(this.program));
                this.z3program = '';
                callback(null);
            }.bind(this));
        }
        else {
            console.log(response);

            this.nextTemplate(true);

            if (this.template)
                this.callZ3(callback);
            else
                callback(null);
        }
    }.bind(this));

}

Solver.prototype.nextTemplate = function(check_sat) {
    this.template = generator.next_program(this.task.size, this.template, this.task.operators);
    if (!this.template) {
        this.z3sat = true;
        this.z3program = '';
        return;
    }

    console.log(expr_str(this.template));

    this.z3program = '(reset)\n';
    this.z3program += translator.translate_template(this.template, this.task.operators);
    this.z3program += translator.translate_constraint16(this.constraints);
    if (check_sat)
        this.z3program += translator.check_sat();
}

Solver.prototype.solveGuessLoop = function(cb1) {
    var that = this;

    async.whilst(
        function() {
            var ret = (that.templateStatus === 'mismatch') && that.z3sat;
//            console.log('Loop tested ' + ret + that.templateStatus);
            return ret;
        },

        function(cb2) {
            console.log('About to call series');
            async.series([
                function(cb3) {
                    console.log('About to call Z3');
                    that.callZ3(cb3);
                },

                function(cb3) { that.guess(cb3); },

                function(cb3) { cb3(null); cb2(null); }
            ]);
        },

        function(err) {
            console.log('Loop ended');
            cb1(null);
        }
    );

}

Solver.prototype.start = function() {

    var that = this;

    this.z3 = new Z3();

    this.nextTemplate();

    async.series([
        function(callback) {
            that.evaluate(['0xFE5645A7867867B3', '0x45FE35AB35041CD2'], callback);
        },

        that.solveGuessLoop.bind(that)
    ]);

}

Solver.prototype.stop = function() {
    //this.z3.kill();
}