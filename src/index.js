'use strict';

var Lexec = require('LISP.js').exec;
var Lparse = require('LISP.js').parse;
var expr_size = require('./expr_size')
var expr_str = require('./expr_str')
var expr_eval = require('./expr_eval')
var train = require('./train-reader');
var expr_solve = require('./expr_solve');

var expr = "(lambda (x_78631) (fold (shr1 (xor (shl1 (or (or (if0 (and x_78631 (shl1 (shl1 (and (shr16 (and (shr4 x_78631) x_78631)) x_78631)))) 0 x_78631) x_78631) 0)) 0)) 1 (lambda (x_78632 x_78633) (xor (shr4 x_78632) x_78633))))";
console.log(expr_size(Lparse(expr)) == 30);
console.log(expr_str(Lparse(expr)) == expr);

var small_expr = '(lambda (x) (plus (shl1 x) 1))';

console.log(expr_eval(Lparse(small_expr), 0));
console.log(expr_eval(Lparse(small_expr), 1));


var _ = require('underscore'), fs = require('fs'), path = require('path');
    
var problems = null;
var problemsFile = path.join(__dirname, '../problems.json');
var api = require('../src/api.js');
/*
fs.readFile(problemsFile, function (err, data) {
                if (err) throw err;
                problems = JSON.parse(data);
                problems_read();
            });
*/
problems_read();

function problems_read() {
    api.train(3, [], function (problem) {
            console.log(problem);
            //expect(problem.size).to.equal(3);            
        });        
}

console.log(expr_eval(Lparse(small_expr), 3));

var small_fold2 = '(lambda (x_77888) (fold 1 x_77888 (lambda (x_77889 x_77890) (or (shl1 x_77890) x_77889))))';
console.log(expr_eval(Lparse(small_fold2), 0)  == 0x0000000000000080);
console.log(expr_eval(Lparse(small_fold2), 1)  == 0x0000000000000180);
console.log(expr_eval(Lparse(small_fold2), 0x20) == 0x0000000000002080);

var tranJSON = train(3,1);
console.log(tranJSON);
var sol = expr_solve(tranJSON);
console.log(expr_str(sol['s_expr']));

var tranJSON4 = train(4,1);
var sol4 = expr_solve(tranJSON4);
console.log(expr_str(sol4['s_expr']));
