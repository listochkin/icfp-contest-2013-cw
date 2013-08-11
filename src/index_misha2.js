var parser = require('../src/training_parser.js');
var api = require('../src/api.js');
var train = require('../src/training_server.js');
var template = require('../src/to_template.js');

var store_templates = {templates: [], size: 0};

function get_next_template(size){

    if(store_templates.size != size){
        var templates = [];
        templates = parser.get_templates(size,templates);
        console.log('i am here');

        store_templates.size = size;
        store_templates.templates = [];
        for(var i = 0; i < templates.length; i++){
            store_templates.templates.push(templates[i].lisp_arr);
            //console.log(templates[i].template_arr);
        }
    }
    //return store_templates.templates;

    if(store_templates.templates.length)
        return store_templates.templates.pop();
    else
        return false;

}
var templates = [];
/*
 for(var i = 5; i<=30; i++){
 templates[i] = [];
 }
 templates[42] = [];
 size = 5;
 while(size<43){
 if(size > 30)
 size = 42;
 templates[size] = parser(size,templates[size]);
 size++;
 }
 */

size = 12;
//templates = parser(size,templates);
do {
    var t = get_next_template(size);
    console.log(t);
}
while(t)

//console.log(templates);
/*
setInterval(function() {

    if(size > 30)
            size = 11;

    var templates = [];
    templates = parser(size,templates,'fold');
    //templates = train(size,templates,'fold');
    size++;
}, 6000 );
*/
/*
var size = 12;
api.train(size, ["tfold"], function (problem ) {
    //fs.write(file_handle, '{"challenge": "'+ problem.challenge +'", "template": [' + arrtostr(template(problem.challenge))+"]},\n", null, 'ascii', function(err, written) {
    if(problem.challenge != undefined){
        //templ.challenge = problem.challenge;
        console.log(problem.challenge);
        console.log(template(problem.challenge));
    }
});
    */