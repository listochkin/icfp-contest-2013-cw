
var templateUtil = require('../src/template-util.js');
var Lparse = require('LISP.js').parse;
var expr_str = require('../src/expr_str')

var templateStr, variables, template, program;

templateStr = '(lambda (x) (op1 c))';
variables = ['shr1', 'x'];

template = Lparse(templateStr);

program = templateUtil.toProgram(template, variables);
console.log(expr_str(program));


var z3Out = '(model                  \
(define-fun h2 () Op1Type            \
SHL1)                                \
(define-fun h3 () Op2Type            \
OR)                                  \
(define-fun h1 () Op2Type            \
PLUS)                                \
(define-fun h4 () Op0Type            \
C1)                                  \
(define-fun h6 () Op0Type            \
VAR)                                 \
(define-fun h5 () Op0Type            \
VAR)                                 \
)';

var out = Lparse(z3Out);
console.log(expr_str(out));

variables = templateUtil.extractVariables(out);
console.log(variables.toString());