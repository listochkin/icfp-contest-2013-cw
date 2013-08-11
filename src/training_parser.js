var fs = require("fs")

function most_wanted(size,templates,threshold_percentage){
    var total_count = 0;
    var res = [];
    for(var j = 0; j < templates.length; j++){
        total_count += templates[j].count;
    }
    for(var j = 0; j < templates.length; j++){
        if(((templates[j].count*100)/total_count) > threshold_percentage){
            res.push(templates[j]);
            console.log(templates[j].count+' --- '+templates[j].template_str);
        }
    }
    return res;
}

module.exports = function(size,templates,use_fold){
    var suffix = '';
    if((use_fold != undefined) && (use_fold == 'fold')){
        suffix = '_f_';
    }
    else if((use_fold != undefined) && (use_fold == 'tfold')){
        suffix = '_tf_';
    }
    var filename = '../train/data'+suffix+size +'.txt';
    fs.exists(filename, function(exists) {
        if (exists) {
            fs.readFile(filename, function (err, data) {
                if (err) throw err;
                console.log(data.toString());
                var file_text = data.toString();
                var file_arr=file_text.split("\n");
                var s='';
                while((str = file_arr.pop()) != undefined){
                    var reg = /\d/;

                    if(reg.test(str[0])){
                        var sub_str = str.split(" --- ");
                        var temp_arr = sub_str[1].split(",");
                        var template = {count: parseInt(sub_str[0]), template_str: sub_str[1], template_arr: temp_arr };
                        templates.push(template);
                        console.log(template.count);
                        console.log(template.template_str);
                        console.log(template.template_arr);
                    }
                }
            });
        } else {
            console.log('File "'+filename+'" not exist');
        }
    });

    return templates;
}
