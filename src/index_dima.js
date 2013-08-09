var api = require('../src/api.js');


//get_train_problem();

//function get_train_problem() {
//    api.train(3, [], function (problem) {
//        console.log(problem);
//        //expect(problem.size).to.equal(3);
//    });
//}


api.guess('BReDqxrXmK1IdHNtSYxgBfHl', '(lambda (x) (shr4 x))',
    function(response) {
        console.log(response);
    });

//api.evaluate('6BdatAgbqHDAU48VuBp7ic6c', '(lambda (x) (shr1 x)', '["0x00000000000001", "0x00000000000011"]',
//    function(response) {
//        console.log(response);
//    });
