'use strict';

var api = require('../src/api.js');
var expr_str = require('../src/expr_str');
var generator = require('../src/template-generator.js');
var translator = require('../src/translator.js');

var expr;

expr = generator.next_program(11, expr);
//console.log(expr_str(expr));

var operators = [ 'and', 'if0', 'or', 'shl1', 'shr1', 'shr16', 'shr4', 'xor' ];

console.log(translator.translate_template(expr, operators));
console.log(translator.translate_constraint(0, 0));

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