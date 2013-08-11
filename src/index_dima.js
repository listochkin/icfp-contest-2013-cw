var api = require('../src/api.js');

var generator = require('../src/template-generator.js');

var Solver = require('../src/solver.js');
var templateUtil = require('../src/template-util.js');


var task;

/*
api.train(30, [], function (problem) {
        console.log(problem);
});
*/

task = { id: '35qJL2ivaMnl0cQVbBcf6Y4q',
  size: 30,
  operators: [ 'and', 'if0', 'not', 'plus', 'shl1', 'shr1', 'shr16', 'shr4', 'xor' ],
  challenge: '(lambda (x_48485) (shr1 (if0 (shr1 (plus x_48485 (shr1 x_48485))) (plus (shl1 (not (shr16 (plus (shr4 (xor (shr1 (if0 (and (shl1 (shr1 1)) x_48485) (xor x_48485 0) 1)) 1)) x_48485)))) 0) x_48485)))' };
  
//(lambda (x) (and x (plus x (plus x (xor x (plus x (or x (xor 1 (or 1 (and x (xor x (plus x (plus 1 (shr4 (if0 1 1 x)))))))))))))))
//task = {
//    id: 'hkrI7Vc4Wm0I4E6wzAF4e00W',
//    size: 8,
//    operators: ['plus', 'shl1', 'shr1', 'shr16'],
//    program: '(lambda (x_6936) (plus (shl1 (shr1 (shr16 (shr1 x_6936)))) x_6936))'
//};
//
var solver = new Solver(task);
solver.start();
//solver.stop();



//var fs = require('fs'),
//    path = require('path');
//
//var start;
//var size,
//    i;
//
//var fileName;
//
//
//function generate_templates(size, callback) {
//    var expr;
//    var expr_str = require('../src/expr_str');
//
//    expr = generator.next_program(size, expr);
//    while(expr) {
//        callback(expr_str(expr));
//        expr = generator.next_program(size, expr);
//    };
//
//}
//
//size = 10;
//fileName = path.join(__dirname, '../templates/' + size + '.lisp');
//fs.writeFile(fileName, '', function() {});
//i = 0;
//start = new Date().getTime();
//generate_templates(size, function(data) {
//    //fs.appendFile(fileName, data + '\n', function() {});
//    i++;
//})
//
//var end = new Date().getTime();
//
//console.log('templates: ' + i);
//console.log('time: ' + (end - start)/1000);


//api.train(9, [], function (problem) {
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
