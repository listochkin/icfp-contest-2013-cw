var api = require('../src/api.js');

var generator = require('../src/template-generator.js');

var expr_str = require('../src/expr_str');

var expr;

var i = 0;
do {
    expr = generator.next_template(30, expr);
//    console.log(expr_str(expr));
    i++;
} while (expr);
console.log(i);


//api.train(11, ['fold'], function (problem) {
//        console.log(problem);
//});


//api.guess('BReDqxrXmK1IdHNtSYxgBfHl', '(lambda (x) (shr4 x))',
//    function(response) {
//        console.log(response);
//    });

//api.evaluate('6BdatAgbqHDAU48VuBp7ic6c', '(lambda (x) (shr1 x)', '["0x00000000000001", "0x00000000000011"]',
//    function(response) {
//        console.log(response);
//    });
