'use strict';

var api = require('../src/api.js');
var expr_str = require('../src/expr_str');
var generator = require('../src/template-generator.js');
var translator = require('../src/translator.js');
var EOL = require('os').EOL;
var Z3 = require('../src/z3.js');
var templateUtil = require('../src/template-util.js');
var Lparse = require('LISP.js').parse;

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

var operators = [ 'and', 'if0', 'or', 'shl1', 'shr1', 'shr16', 'shr4', 'xor' ];

api.train(3, [], function (problem) {
        console.log(problem/*.challenge*/);
        
        var expr;
        //for (var i = 0; i < 300; i++)
            expr = generator.next_program(problem.size, expr);
        console.log(expr_str(expr));
        
        
        
        var problem = translator.translate_template(expr, operators);
        problem += translator.translate_constraint(0, 0);
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