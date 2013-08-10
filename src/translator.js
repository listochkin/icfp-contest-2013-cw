'use strict';

var bootstrap = '(define-sort Val () (_ BitVec 64))\n\
\n\
(declare-datatypes () ((Op1Type NOT SHL1 SHR1 SHR4 SHR16)))\n\
(declare-datatypes () ((Op2Type AND OR XOR PLUS)))\n\
(declare-datatypes () ((Op0Type C0 C1 VAR)))\n\
(declare-datatypes () ((Op0TypeFold C0F C1F V1 V2 V3)))\n\
\n\
(define-fun z_not\n\
    ((x Val)) Val\n\
    (bvnot x)\n\
)\n\
\n\
(define-fun z_shl1\n\
    ((x Val)) Val\n\
    (bvshl x (_ bv1 64))\n\
)\n\
\n\
(define-fun z_shr1\n\
    ((x Val)) Val\n\
    (bvlshr x (_ bv1 64))\n\
)\n\
\n\
(define-fun z_shr4\n\
    ((x Val)) Val\n\
    (bvlshr x (_ bv4 64))\n\
)\n\
\n\
(define-fun z_shr16\n\
    ((x Val)) Val\n\
    (bvlshr x (_ bv16 64))\n\
)\n\
\n\
; op2s for variables\n\
(define-fun z_and\n\
  ((x Val) (y Val)) Val\n\
   (bvand x y)\n\
)\n\
\n\
(define-fun z_or\n\
  ((x Val) (y Val)) Val\n\
   (bvor x y)\n\
)\n\
\n\
(define-fun z_xor\n\
  ((x Val) (y Val)) Val\n\
   (bvxor x y)\n\
)\n\
\n\
(define-fun z_plus\n\
  ((x Val) (y Val)) Val\n\
   (bvadd x y)\n\
)\n\
\n\
(define-fun z_if0 ((e Val) (a Val) (b Val)) Val\n\
    (ite (= e (_ bv0 64)) a b)\n\
)\n\
\n\
; synth functions\n\
\n\
(define-fun synth_op0 ((x Op0Type)(v Val)) Val\n\
    (if (= x VAR)\n\
	v\n\
	(if (= x C0)\n\
		(_ bv0 64)\n\
		(_ bv1 64))))\n\
\n\
(define-fun synth_op0_fold ((x Op0TypeFold)(v Val)(v2 Val)(v3 Val)) Val\n\
    (if (= x V1)\n\
	v\n\
	(if (= x V2)\n\
	    v2\n\
	    (if (= x V3)\n\
		v3\n\
		(if (= x C0F)\n\
		    (_ bv0 64)\n\
		    (_ bv1 64))))))\n\
\n\
\n\
(define-fun synth_op1 ((h Op1Type)(v Val)) Val\n\
    (if (= h NOT)\n\
        (z_not v)\n\
        (if (= h SHL1)\n\
        	(z_shl1 v)\n\
        	(if (= h SHR1)\n\
        		(z_shr1 v)\n\
        		(if (= h SHR4)\n\
	        		(z_shr4 v)\n\
	        		(z_shr16 v))))))\n\
\n\
(define-fun synth_op2 ((h Op2Type)(v1 Val)(v2 Val)) Val\n\
    (if (= h AND)\n\
        (z_and v1 v2)\n\
        (if (= h OR)\n\
        	(z_or v1 v2)\n\
        	(if (= h XOR)\n\
        		(z_xor v1 v2)\n\
        		(z_plus v1 v2)))))\n\
\n\
\n\
';

var expr_size = require('./expr_size.js');
var expr_str = require('./expr_str.js');

module.exports = {    
    translate_template: translate_template,
    translate_constraint: translate_constraint
}
/*
var generator = require('./template-generator.js');

var expr;
for (var i = 0; i < 10; i++) {
    expr = generator.next_program(10, expr);
}

var operators = [ 'and', 'if0', 'or', 'shl1', 'shr1', 'shr16', 'shr4', 'xor' ];

console.log(expr_str(expr));
console.log(translate_template(expr, operators));
console.log(translate_constraint(0, 0));
//translate_template(expr, operators)
*/


function expr_tokenize(s_expr) {
    if(s_expr instanceof Array) {
            
            for (var i = 0; i < s_expr.length; i++) {
                
                if(s_expr[i] instanceof Array) 
                    expr_tokenize(s_expr[i]);
                else
                    switch(s_expr[i]) {
                        case 'op1':
                            s_expr[i] = 'synth_op1 h'+global.cur_op;
                            global.ops+='(declare-const h'+global.cur_op+' Op1Type)\n';
                            global.cur_op++;
                            break;
                        case 'op2':
                            s_expr[i] = 'synth_op2 h'+global.cur_op;
                            global.ops+='(declare-const h'+global.cur_op+' Op2Type)\n';
                            global.cur_op++;
                            break;
                        case 'c':
                            s_expr[i] = '(synth_op0 h'+global.cur_op+' x)';
                            global.ops+='(declare-const h'+global.cur_op+' Op0Type)\n';
                            global.cur_op++;
                            break;
                    }
            }
    }
}

function translate_template(template, operators) {
    var smt2 = bootstrap;
    
    global.ops = '';
    global.cur_op = 1;    
    var lambda = '(define-fun lambda ((x Val)) Val \n    '; 
    
    var expr = template.slice(2)[0];
    expr_tokenize(expr);
    
    //console.log(expr);
    
    lambda += expr_str(expr) + ')\n';
    
    smt2+=ops+'\n';
    smt2+=lambda;
    return smt2;
}

function translate_constraint(input, output) {
    var smt2 ='(assert (= (lambda #x';
    smt2+= ("000000000000000" + input.toString(16)).substr(-16);
    smt2+=') #x';
    smt2+= ("000000000000000" + output.toString(16)).substr(-16);
    smt2+='))\n(check-sat)\n(get-model)\n\n';
    return smt2;
}