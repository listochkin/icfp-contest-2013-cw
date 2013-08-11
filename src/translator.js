'use strict';

var expr_size = require('./expr_size.js');
var expr_str = require('./expr_str.js');

module.exports = {    
    translate_template: translate_template,
    translate_constraint: translate_constraint,
    translate_constraint16: translate_constraint16,
    check_sat: check_sat
}

/*
var generator = require('./template-generator.js');

var expr;
for (var i = 0; i < 10; i++) {
    expr = generator.next_program(10, expr);
}

//var operators = [ 'and', 'if0', 'or', 'shl1', 'shr1', 'shr16', 'shr4', 'xor' ];
var operators = [ 'if0', 'shl1', 'or'];

//console.log(operators);
//console.log(expr_str(expr));
console.log(translate_template(expr, operators));
console.log(translate_constraint(0, 0));
//translate_template(expr, operators)
*/

function deepCopy(obj) {
  if (typeof obj == 'object') {
    if (isArray(obj)) {
      var l = obj.length;
      var r = new Array(l);
      for (var i = 0; i < l; i++) {
        r[i] = deepCopy(obj[i]);
      }
      return r;
    } else {
      var r = {};
      r.prototype = obj.prototype;
      for (var k in obj) {
        r[k] = deepCopy(obj[k]);
      }
      return r;
    }
  }
  return obj;
}

var ARRAY_PROPS = {
  length: 'number',
  sort: 'function',
  slice: 'function',
  splice: 'function'
};

/**
 * Determining if something is an array in JavaScript
 * is error-prone at best.
 */
function isArray(obj) {
  if (obj instanceof Array)
    return true;
  // Otherwise, guess:
  for (var k in ARRAY_PROPS) {
    if (!(k in obj && typeof obj[k] == ARRAY_PROPS[k]))
      return false;
  }
  return true;
}


function translate_template(template, operators) {
    
    var isOp1 = false;
    var isOp2 = false;
    var isIf = false;
    var isFold = false;
    var isTfold = false;
    var op1type = '';
    var op2type = '';
    var ops = '';
    var op1syn = '';
    var op1sync = '';
    var op2syn = '';
    var op2sync = '';
    var op1any = '';
    var op2any = '';
    var op1num = 0;
    var op2num = 0;
    
    operators.map(function(x) {
        switch(x)
        {
            case 'not':
                op1type+=' NOT';
                ops+='(define-fun z_not\n\
    ((x Val)) Val\n\
    (bvnot x)\n\
)\n\
\n\
';
                op1syn += '(if (= h NOT) (z_not v) ';
                op1sync += ')';
                op1any = '(z_not v)';
                op1num++;
                isOp1 = true;
                break;
            case 'shl1':
                op1type+=' SHL1';
                ops+='(define-fun z_shl1\n\
    ((x Val)) Val\n\
    (bvshl x (_ bv1 64))\n\
)\n\
\n\
';
                op1syn += '(if (= h SHL1) (z_shl1 v) ';
                op1sync += ')';
                op1any = '(z_shl1 v)';
                op1num++;
                isOp1 = true;
                break;
            case 'shr1':
                op1type+=' SHR1';
                ops+='(define-fun z_shr1\n\
    ((x Val)) Val\n\
    (bvlshr x (_ bv1 64))\n\
)\n\
\n\
';
                op1syn += '(if (= h SHR1) (z_shr1 v) ';
                op1sync += ')';
                op1any = '(z_shr1 v)';
                op1num++;
                isOp1 = true;
                break;
            case 'shr4':
                op1type+=' SHR4';
                ops+='(define-fun z_shr4\n\
    ((x Val)) Val\n\
    (bvlshr x (_ bv4 64))\n\
)\n\
\n\
';
                op1syn += '(if (= h SHR4) (z_shr4 v) ';
                op1sync += ')';
                op1any = '(z_shr4 v)';
                op1num++;
                isOp1 = true;
                break;
            case 'shr16':
                op1type+=' SHR16';
                ops+='(define-fun z_shr16\n\
    ((x Val)) Val\n\
    (bvlshr x (_ bv16 64))\n\
)\n\
\n\
';
                op1syn += '(if (= h SHR16) (z_shr16 v) ';
                op1sync += ')';
                op1any = '(z_shr16 v)';
                op1num++;
                isOp1 = true;
                break;
            case 'and':
                op2type+=' AND';
                ops+='(define-fun z_and\n\
  ((x Val) (y Val)) Val\n\
   (bvand x y)\n\
)\n\
\n\
';
                op2syn += '(if (= h AND) (z_and v1 v2) ';
                op2sync += ')';
                op2any = '(z_and v1 v2)';
                op2num++;
                isOp2 = true;
                break;
            case 'or':
                op2type+=' OR';
                ops+='(define-fun z_or\n\
  ((x Val) (y Val)) Val\n\
   (bvor x y)\n\
)\n\
';
                op2syn += '(if (= h OR) (z_or v1 v2) ';
                op2sync += ')';
                op2any = '(z_or v1 v2)';
                op2num++;
                isOp2 = true;
                break;
            case 'xor':
                op2type+=' XOR';
                ops+='(define-fun z_xor\n\
  ((x Val) (y Val)) Val\n\
   (bvxor x y)\n\
)\n\
\n\
';
                op2syn += '(if (= h XOR) (z_xor v1 v2) ';
                op2sync += ')';
                op2any = '(z_xor v1 v2)';
                op2num++;
                isOp2 = true;
                break;
            case 'plus':
                op2type+=' PLUS';
                ops+='(define-fun z_plus\n\
  ((x Val) (y Val)) Val\n\
   (bvadd x y)\n\
)\n\
\n\
';
                op2syn += '(if (= h PLUS) (z_plus v1 v2) ';
                op2sync += ')';
                op2any = '(z_plus v1 v2)';
                op2num++;
                isOp2 = true;
                break;
            case 'if0':
                ops+='(define-fun z_if0 ((e Val) (a Val) (b Val)) Val\n\
    (ite (= e (_ bv0 64)) a b)\n\
)\n\
\n\
';
                isIf = true;
                break;
            case 'fold':
                ops+='';
                isFold = true;
                break;
            case 'tfold':
                ops+='';                
                isTfold = true;
                break;
        }
    });
    
    var bootstrap = '(define-sort Val () (_ BitVec 64))\n\
\n\
(declare-datatypes () ((Op0Type C0 C1 VAR)))\n';
    if(isOp1) {
        bootstrap += '(declare-datatypes () ((Op1Type '+op1type+' )))\n';        
    }
    if(isOp2) {
        bootstrap += '(declare-datatypes () ((Op2Type '+op2type+' )))\n';        
    }
    if(isFold)
        bootstrap += '(declare-datatypes () ((Op0TypeFold C0F C1F V1 V2 V3)))\n';
    if(isTfold)
        bootstrap += '(declare-datatypes () ((Op0TypeFold C0F C1F V1 V2)))\n';

    bootstrap += '\n' + ops + '\n\
; synth functions\n\
\n\
(define-fun synth_op0 ((x Op0Type)(v Val)) Val\n\
    (if (= x VAR)\n\
	v\n\
	(if (= x C0)\n\
		(_ bv0 64)\n\
		(_ bv1 64))))\n\
\n';
            
    if (isOp1)
        bootstrap += '\n\
(define-fun synth_op1 ((h Op1Type)(v Val)) Val\n ' + op1syn + op1any + op1sync +')\n\n';
        
    if (isOp2)
        bootstrap += '\n\
(define-fun synth_op2 ((h Op2Type)(v1 Val)(v2 Val)) Val\n\ ' + op2syn + op2any + op2sync +')\n\n';

    var smt2 = bootstrap;
    
    var ops = '';
    var cur_op = 0;    
    var lambda = '(define-fun lambda ((x1 Val)) Val \n    ';
    var fold_lambda = '';
    
    var expr = deepCopy(template.slice(2)[0]);
    var foldExpr = null;
    var foldOps = '';
    
    expr_tokenize(expr);
    
    if(foldExpr)
        expr_tokenize_fold(foldExpr);
    
    function expr_tokenize(s_expr) {
        if(s_expr instanceof Array) {
                
                for (var i = 0; i < s_expr.length; i++) {
                    
                    if(!(s_expr[i] instanceof Array)) 
                        switch(s_expr[i]) {
                            case 'op1':
                                s_expr[i] = 'synth_op1 h'+cur_op;
                                ops+='(declare-const h'+cur_op+' Op1Type)\n';
                                cur_op++;
                                break;
                            case 'op2':
                                s_expr[i] = 'synth_op2 h'+cur_op;
                                ops+='(declare-const h'+cur_op+' Op2Type)\n';
                                cur_op++;
                                break;
                            case 'c':
                                s_expr[i] = '(synth_op0 h'+cur_op+' x1)';
                                ops+='(declare-const h'+cur_op+' Op0Type)\n';
                                cur_op++;
                                break;
                            case 'if0':
                                s_expr[i] = 'z_if0';                                
                                break;
                            case 'fold':
                                s_expr[i] = 'z_fold x1';
                                foldExpr = s_expr.splice(-1, 1)[0][2];
                                if(isTfold)
                                    s_expr.splice(1, 2, 'x1', '(_ bv0 64)');
                                //[3] = undefined;
                                console.log('!!!!!!!dfg ' + s_expr);
                                break;
                            /*case 'x1':
                                s_expr[i] = 'x';
                                break;*/
                        }
                    else if(s_expr[i] instanceof Array) 
                        expr_tokenize(s_expr[i]);
                }
            }
    }
    
    function expr_tokenize_fold(s_expr) {
        if(s_expr instanceof Array) {
                
                for (var i = 0; i < s_expr.length; i++) {
                    
                    if(!(s_expr[i] instanceof Array)) 
                        switch(s_expr[i]) {
                            case 'op1':
                                s_expr[i] = 'synth_op1 h'+cur_op;
                                ops+='(declare-const h'+cur_op+' Op1Type)\n';
                                cur_op++;
                                break;
                            case 'op2':
                                s_expr[i] = 'synth_op2 h'+cur_op;
                                ops+='(declare-const h'+cur_op+' Op2Type)\n';
                                cur_op++;
                                break;
                            case 'c':
                                s_expr[i] = '(synth_op0_fold h'+cur_op+' xAbove x '+(isTfold ? '' : 'y')+')';
                                ops+='(declare-const h'+cur_op+' Op0TypeFold)\n';
                                cur_op++;
                                break;
                            case 'if0':
                                s_expr[i] = 'z_if0';                                
                                break;                            
                        }                    
                    else if(s_expr[i] instanceof Array) 
                        expr_tokenize_fold(s_expr[i]);
                }
            }
    }
    
    //console.log(expr);
    
    lambda += expr_str(expr) + ')\n\n';
    
    smt2+=ops+'\n';
    
    if(isFold)
        smt2 += '(define-fun synth_op0_fold ((x Op0TypeFold)(v Val)(v2 Val)(v3 Val)) Val\n';
    if(isTfold)
        smt2 += '(define-fun synth_op0_fold ((x Op0TypeFold)(v Val)(v2 Val)) Val\n';
    
    if(isTfold)
        smt2 += '(if (= x V1)\n\
	v\n\
	(if (= x V2)\n\
	    v2\n\
            (if (= x C0F)\n\
		(_ bv0 64)\n\
		(_ bv1 64)))))\n';
    if(isFold)
        smt2 += '(if (= x V1)\n\
	v\n\
	(if (= x V2)\n\
	    v2\n\
	    (if (= x V3)\n\
		v3\n\
		(if (= x C0F)\n\
		    (_ bv0 64)\n\
		    (_ bv1 64))))))\n';
smt2 += '\n\
(define-fun z_fold_i ((x Val) (i Val)) Val\n\
  (bvand (bvlshr x i) (_ bv255 64))\n\
)\n\
(define-fun z_fold_op ((xAbove Val)(x Val)(y Val)) Val '+ expr_str(foldExpr) +')\n\
        (define-fun z_fold\n\
   ((xAbove Val) (x Val) (y Val) \n\
; cant declare functional type\n\
; redefeine z_fold_op function to call lambda\n\
;    (z_fold_op FoldVal)\n\
    ) Val\n\
   (z_fold_op xAbove (z_fold_i x (_ bv56 64))\n\
   (z_fold_op xAbove (z_fold_i x (_ bv48 64))\n\
   (z_fold_op xAbove (z_fold_i x (_ bv40 64))\n\
   (z_fold_op xAbove (z_fold_i x (_ bv32 64))\n\
   (z_fold_op xAbove (z_fold_i x (_ bv24 64))\n\
   (z_fold_op xAbove (z_fold_i x (_ bv16 64))\n\
   (z_fold_op xAbove (z_fold_i x (_ bv8 64))\n\
   (z_fold_op xAbove (z_fold_i x (_ bv0 64)) y))))))))\n\
)\n\n';
    smt2+=lambda;
    return smt2;
}

function translate_constraint(input, output) {
    var smt2 ='(assert (= (lambda #x';
    smt2+= ("000000000000000" + input.toString(16)).substr(-16);
    smt2+=') #x';
    smt2+= ("000000000000000" + output.toString(16)).substr(-16);
    smt2+='))\n(check-sat)\n\n';
    return smt2;
}

// constraints is string[][] where constraint[n][0] is input
// and constraint[n][1] is output
function translate_constraint16(constraints) {
    var input;
    var output;
    var smt2;
    var i;

    smt2 = '\n';
    for (i = 0; i < constraints.length; i += 1) {
        input = constraints[i][0].replace('0x', '#x');
        output = constraints[i][1].replace('0x', '#x');

        smt2 += '(assert (= (lambda ' + input;
        smt2 += ') ' + output;
        smt2 += '))\n';
    }
//    smt2 += '\n(check-sat)\n\n';
    return smt2;
}

function check_sat() {
   return '\n(check-sat)\n\n';
}