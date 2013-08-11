var api = require('../src/api.js');
stringify = require('json-stringify-safe');

var generator = require('../src/template-generator.js');


//////////////////////////////////////////////////////////////////

var expr_str = require('../src/expr_str.js');
var prog;

var i = 0;


var op1 = ['not'];
var op12 = ['not', 'and'];
var op2 = ['and'];
var op1if = ['not', 'if0'];
var op2if = ['and', 'if0'];
var op12if = ['not', 'and', 'if0'];


var size = 8;

function templates(size, operators) {
    prog = generator.next_program(size, prog, operators );
    while (prog) {
        i++;
    //    console.log(expr_str(prog));
        console.log(stringify(prog));
        prog = generator.next_program(size, prog, operators );
    }
}

//templates(size, op1);
//templates(size, op2);
//templates(size, op12);
//templates(size, op1if);
//templates(size, op2if);
//templates(size, op12if);

templates(15, op12if);

console.log(i);