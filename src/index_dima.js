var api = require('../src/api.js');

var generator = require('../src/template-generator.js');

var Solver = require('../src/solver.js');
var templateUtil = require('../src/template-util.js');

global.problems_solved = 0;

function solve_problem_train() {
    api.train(20, [], function (problem) {
//    problem = { id: 'anwX0ykmLU2zmplwr9v8padw',
//  size: 7,
//  operators: [ 'plus', 'shl1', 'shr16', 'shr4' ],
//  challenge: '(lambda (x_6542) (plus (shl1 x_6542) (shr4 (shr16 x_6542))))' };
  
        console.log('solve_problem train ');
        console.log(problem);        
      
        console.log('Solving... solved so far:' +(global.problems_solved++)); 
    //          console.log(problems[p]); 
    
        //solve_problem(p - 1);
    
        var solver = new Solver(problem); 
        solver.start(function () {
            console.log('START.CALLBACK '); 
            solve_problem_train();
        });
    });
}
solve_problem_train();


function solve_problem(p) {
    console.log('solve_problem ' + p);
    if (p <= 0)
        return;
    
    while(problems[p].size >= 8
          || problems[p].operators.indexOf('fold') != -1
          || problems[p].operators.indexOf('tfold') != -1
          || problems[p].operators.indexOf('bonus') != -1
          || problems[p].solved
          || (problems[p].solved === false && !problems[p].timeLeft)) {
        console.log('skipping '+p);
        p--;
        if (p <= 0)
            return;
    }
  
  
    var problem = problems[p]; 
    console.log('Solving #' + p + ' solved so far:' +(global.problems_solved++) +'\n'+ JSON.stringify(problem)); 
//          console.log(problems[p]); 

    //solve_problem(p - 1);

    var solver = new Solver(problem); 
    solver.start(function () {
        //console.log('START.CALLBACK '); 
        solve_problem(p - 1);
    });

} 

/* 
var problems = null; 
var _ = require('underscore'), fs = require('fs'), path = require('path'); 
var problemsFile = path.join(__dirname, '../problems.json');


api.problems(function (body) { 
    problems = _.sortBy(body, function (p) { 
        return p.size; 
    }); 
    fs.writeFileSync(problemsFile, JSON.stringify(problems, null, '\t')); 
    
//  console.log(problems); 
  
    solve_problem(problems.length - 1); 
});
*/

//var task;

/*
api.train(30, [], function (problem) {
        console.log(problem);
});
*/

/*
task = { id: '35qJL2ivaMnl0cQVbBcf6Y4q',
  size: 30,
  operators: [ 'and', 'if0', 'not', 'plus', 'shl1', 'shr1', 'shr16', 'shr4', 'xor' ],
  challenge: '(lambda (x_48485) (shr1 (if0 (shr1 (plus x_48485 (shr1 x_48485))) (plus (shl1 (not (shr16 (plus (shr4 (xor (shr1 (if0 (and (shl1 (shr1 1)) x_48485) (xor x_48485 0) 1)) 1)) x_48485)))) 0) x_48485)))' };
*/  
//(lambda (x) (and x (plus x (plus x (xor x (plus x (or x (xor 1 (or 1 (and x (xor x (plus x (plus 1 (shr4 (if0 1 1 x)))))))))))))))
//task = {
//    id: 'hkrI7Vc4Wm0I4E6wzAF4e00W',
//    size: 8,
//    operators: ['plus', 'shl1', 'shr1', 'shr16'],
//    program: '(lambda (x_6936) (plus (shl1 (shr1 (shr16 (shr1 x_6936)))) x_6936))'
//};
//
//var solver = new Solver(task);
//solver.start();
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
