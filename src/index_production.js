var api = require('../src/api.js');

var generator = require('../src/template-generator.js');

var Solver = require('../src/solver.js');
var templateUtil = require('../src/template-util.js');


function solve_problem(p) {
    console.log('solve_problem ' + p);
    if (p > 2000)
        return;

    while(problems[p].size === 12
     || problems[p].operators.indexOf('fold') != -1
        || problems[p].operators.indexOf('tfold') != -1
        || problems[p].operators.indexOf('bonus') != -1
        || problems[p].solved
        || (problems[p].solved === false && !problems[p].timeLeft)) {
        console.log('skipping '+p);
        p++;
        if (p <= 0)
            return;
    }


    var problem = problems[p];
    console.log('Solving #' + p + ' solved so far:' +(global.problems_solved++) +'\n'+ JSON.stringify(problem)+'\n\n');
//          console.log(problems[p]); 

    //solve_problem(p - 1);

    var solver = new Solver(problem);
    solver.start(function () {
        //console.log('START.CALLBACK '); 
        solve_problem(p + 1);
    });

}


var problems = null;
var _ = require('underscore'), fs = require('fs'), path = require('path');
var problemsFile = path.join(__dirname, '../problems.json');

api.problems(function (body) {
    console.log();

    problems = _.sortBy(JSON.parse(body), function (p) {
        return p.size;
    });
    fs.writeFileSync(problemsFile, JSON.stringify(problems, null, '\t'));

    console.log(problems);

    solve_problem(0);

});
