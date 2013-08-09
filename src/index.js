'use strict';

var Lexec = require('LISP.js').exec;
var Lparse = require('LISP.js').parse;
var expr_size = require('./expr_size')
var expr_str = require('./expr_str')
var expr_eval = require('./expr_eval')

var expr = "(lambda (x_78631) (fold (shr1 (xor (shl1 (or (or (if0 (and x_78631 (shl1 (shl1 (and (shr16 (and (shr4 x_78631) x_78631)) x_78631)))) 0 x_78631) x_78631) 0)) 0)) 1 (lambda (x_78632 x_78633) (xor (shr4 x_78632) x_78633))))";
console.log(expr_size(Lparse(expr)) == 30);
console.log(expr_str(Lparse(expr)) == expr);

var small_expr = '(lambda (x) (plus (shl1 x) 1))';

console.log(expr_eval(Lparse(small_expr), 0));
console.log(expr_eval(Lparse(small_expr), 1));
