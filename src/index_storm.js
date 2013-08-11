'use strict';

//var api = require('../src/api.js');
var expr_str = require('../src/expr_str');
var generator = require('../src/template-generator.js');
var translator = require('../src/translator.js');
var EOL = require('os').EOL;
var Z3 = require('../src/z3.js');
var templateUtil = require('../src/template-util.js');
var Lparse = require('LISP.js').parse;

var buggy =
{ id: 'anwX0ykmLU2zmplwr9v8padw',
  size: 7,
  operators: [ 'plus', 'shl1', 'shr16', 'shr4' ],
  challenge: '(lambda (x_6542) (plus (shl1 x_6542) (shr4 (shr16 x_6542))))' };

// '(lambda (x1) (op2 (op1 x) (op1 (op1 x))))'

var operators = ['plus', 'fold'];//[ 'xor', 'plus', 'and', 'or', 'not', 'shl1', 'shr1', 'shr16', 'shr4', 'tfold' ];
var expr;

for (var i = 0; i < 1; i++) {
    expr = generator.next_program(12, expr, operators);
    //console.log(expr_str(expr));
    //if (!expr)
      //  break;
}

console.log(expr_str(expr));


var problem = translator.translate_template(expr, operators);
problem += translator.translate_constraint(0, 1);

console.log(problem);

var z3 = new Z3();

z3.write(problem, function (response) {
    console.log(response);
    if(response.indexOf('sat') != -1)
        z3.write('(get-model)', function (response) {
            console.log(response);
            
            var variables = templateUtil.extractVariables(response);
            console.log(variables);
            
            console.log(expr_str(templateUtil.toProgram(expr, variables, operators)));
            //expect(response.substr(0, 6)).to.equal('(model')
            
            //done();
        }); 
    z3.kill();
});

/*
function Solver(task) {
    var constrains,
        template;
    
    
    function eval(args, program) {
        api.evaluate(task.id, )
    }
    //code
}
*/
//console.log(expr_str(expr));

//var operators = [ 'and', 'if0', 'or', 'shl1', 'shr1', 'shr16', 'shr4', 'xor' ];
/*
api.train(15, [], function (train) {
        console.log(train);
        
        var expr;
        //for (var i = 0; i < 300; i++)
            expr = generator.next_program(train.size, expr, train.operators);
        console.log(expr_str(expr));
        
        var constraint = "0xFE5645A7867867B3";
        api.evaluate(train.id, '', [constraint], function (evaluate) {
            
            console.log(evaluate);
        
            var problem = translator.translate_template(expr, train.operators);
            problem += translator.translate_constraint(constraint, evaluate.outputs[0]);
            
            console.log(problem);
            
            var z3 = new Z3();
            
            z3.write(problem, function (response) {
                console.log(response);
                if(response.indexOf('sat') != -1 && response.indexOf('unsat') == -1)
                    z3.write('(get-model)', function (response) {
                        console.log(response);
                        
                        var variables = templateUtil.extractVariables(response);
                        console.log(variables);
                        console.log(expr_str(templateUtil.toProgram(expr, variables)));
                        //expect(response.substr(0, 6)).to.equal('(model')
                        
                        //done();
                    }); 
                z3.kill();
            });
        });
    });
/*

var problem = translator.translate_template(expr, operators);
problem += translator.translate_constraint(0, 1);

var z3 = new Z3();

z3.write(problem, function (response) {
    console.log(response);
    if(response.indexOf('sat') != -1)
        z3.write('(get-model)', function (response) {
            console.log(response);
            
            var variables = templateUtil.extractVariables(response);
            console.log(variables);
            console.log(expr_str(templateUtil.toProgram(expr, variables)));
            //expect(response.substr(0, 6)).to.equal('(model')
            
            //done();
        }); 
    z3.kill();
});


/*
api.train(5, [], function (problem) {
        console.log(problem.challenge);
        //expect(problem.size).to.equal(3);            
    });        
    
/*
var Lexec = require('LISP.js').exec;
var Lparse = require('LISP.js').parse;
var expr_size = require('./expr_size')
var expr_str = require('./expr_str')
var expr_eval = require('./expr_eval')
var train = require('./train-reader');
var expr_solve = require('./expr_solve');

var small_expr = '(lambda (x) (plus (shl1 x) 1))';



var _ = require('underscore'), fs = require('fs'), path = require('path');
    
var problems = null;
var problemsFile = path.join(__dirname, '../problems.json');
var api = require('../src/api.js');

fs.readFile(problemsFile, function (err, data) {
                if (err) throw err;
                problems = JSON.parse(data);
                problems_read();
            });

problems_read();
*/