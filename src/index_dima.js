var api = require('../src/api.js');

var generator = require('../src/template-generator.js');

var fs = require('fs'),
    path = require('path');

var start;
var size,
    i;

var fileName;


function generate_templates(size, callback) {
    var expr;
    var expr_str = require('../src/expr_str');

    expr = generator.next_program(size, expr);
    while(expr) {
        //callback(expr_str(expr));
        expr = generator.next_program(size, expr);
    };

}

size = 14;
fileName = path.join(__dirname, '../templates/' + size + '.lisp');
fs.writeFile(fileName, '', function() {});
i = 0;
start = new Date().getTime();
generate_templates(size, function(data) {
    //fs.appendFile(fileName, data + '\n', function() {});
    i++;
})

var end = new Date().getTime();

console.log('templates: ' + i);
console.log('time: ' + (end - start)/1000);


//api.train(15, ['tfold'], function (problem) {
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
