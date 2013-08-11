var api = require('../src/api.js');
var generator = require('../src/template-generator.js');
var template = require('../src/to_template.js');
var fs = require("fs"),
    sys = require("sys");

//var templ = {challenge: '', template_str: '', count: 1 };

function arrtostr(a){
    var s = a[0];
    for(var i = 1; i<a.length; i++){
        s = s+ ','+a[i];
    }

    return s;
}

function get_top(arr, size, filename){
    var total_count = 0;
    var idx = [];
    var max_top = 10000;
    var max = 0;

    fs.open(filename, "w", 0644, function(err, file_handle) {
        if (!err) {
            for(var j = 0; j<arr.length; j++){
                max = 0;
                var max_i = -1;
                for(var i = 0; i<arr.length; i++){
                    if((max <= max_top) && (arr[i].count >=max) &&(idx[i]== undefined)){
                        max =  arr[i].count;
                        max_i = i;
                    }

                }
                console.log(arr[max_i].count+' --- '+arr[max_i].template_str);
                fs.write(file_handle, arr[max_i].count+' --- '+arr[max_i].template_str + "\n", null, 'ascii', function(err, written) {
                    if (err) {
                        console.log("Some fucking happend");
                    }
                });
                max_top = max;
                idx[max_i] = j;
                total_count += arr[max_i].count;
            }
            console.log('Total count: '+total_count);
            fs.write(file_handle, 'Total count: '+total_count+ "\n ---------------- \n", null, 'ascii', function(err, written) {
                if (err) {
                    console.log("Some fucking happend");
                }
            });
        }
    });
}

module.exports = function(size,templates,use_fold){
    //var templ = {challenge: '', template_str: '', count: 1 };
    var templ = {template_str: '', count: 1 };
    var suffix = '';
    var  api_array = [];
    if((use_fold != undefined) && (use_fold == 'fold')){
        suffix = '_f_';
        api_array = ["fold"];
    }
    else if((use_fold != undefined) && (use_fold == 'tfold')){
        suffix = '_tf_';
        api_array = ["tfold"];
    }
    var filename = '../train/data'+suffix+size +'.txt';
    api.train(size, api_array, function (problem ) {
        //fs.write(file_handle, '{"challenge": "'+ problem.challenge +'", "template": [' + arrtostr(template(problem.challenge))+"]},\n", null, 'ascii', function(err, written) {
        if(problem.challenge != undefined){
            //templ.challenge = problem.challenge;
            templ.template_str = arrtostr(template(problem.challenge)) ;
            templ.count= 1;
            for(var i = 0; i<templates.length; i++){
                if(templates[i].template_str == templ.template_str){
                    templates[i].count++;
                    //console.log(templates[i].count+' --- '+templates[i].template_str);
                    get_top(templates,size, filename);
                    templ = false;
                }
            }
            if(templ){
                templates.push(templ);
                get_top(templates, size, filename);
                //console.log(templ.count+' --- '+templ.template_str);
            }
            }
    });

    return templates;
}

//module.exports = train;