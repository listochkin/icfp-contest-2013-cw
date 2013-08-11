var fs = require("fs")

var store_templates = {templates: [], size: 0, use_fold: undefined};

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

function get_lisp_format(arr, use_fold){
    var res_arr = arr;

    do {
        var count, total_count = 0;
        do {
            count = 0;
            for(var i = (res_arr.length -1); i >= 0; i--){
                if((res_arr[i] == "op1") && ((res_arr[i+1] == 'c') || (typeof res_arr[i+1] == "object"))){
                    var part_arr = res_arr.slice(i,(i+2))
                    res_arr[i] = part_arr;
                    res_arr.splice(i+1,1);
                    count++;
                    total_count++;
                }
            }
        }
        while(count > 0)
        do {
            count = 0;
            for(var i = (res_arr.length -2); i >= 0; i--){
                if((res_arr[i] == "op2") && ((res_arr[i+1] == 'c') || (typeof res_arr[i+1] == "object")) && ((res_arr[i+2] == 'c') || (typeof res_arr[i+2] == "object"))){
                    var part_arr = res_arr.slice(i,(i+3))
                    res_arr[i] = part_arr;
                    res_arr.splice(i+1,2);
                    count++;
                    total_count++;
                }
            }
        }
        while(count > 0)
        do {
            count = 0;
            for(var i = (res_arr.length -3); i >= 0; i--){
                if((res_arr[i] == "if0") &&
                    ((res_arr[i+1] == 'c') || (typeof res_arr[i+1] == "object")) &&
                    ((res_arr[i+2] == 'c') || (typeof res_arr[i+2] == "object")) &&
                    ((res_arr[i+3] == 'c') || (typeof res_arr[i+3] == "object"))
                    ){
                    var part_arr = res_arr.slice(i,(i+4))
                    res_arr[i] = part_arr;
                    res_arr.splice(i+1,3);
                    count++;
                    total_count++;
                }
            }
        }
        while(count > 0)

        if(use_fold == "tfold")
            do {
                count = 0;
                for(var i = (res_arr.length -3); i >= 0; i--){
                    if((res_arr[i] == "fold") &&
                        ((res_arr[i+1] == 'c') || (typeof res_arr[i+1] == "object")) &&
                        ((res_arr[i+2] == 'c') || (typeof res_arr[i+2] == "object")) &&
                        ((res_arr[i+3] == 'c') || (typeof res_arr[i+3] == "object"))
                        ){
                        var part_arr = ['fold', 'x1', '0', ['lambda', ['x1', 'x2'], res_arr[i+3]]];
                        console.log(part_arr);
                        res_arr[i] = part_arr;
                        res_arr.splice(i+1,3);
                        count++;
                        total_count++;
                    }
                }
            }
            while(count > 0)
        if(use_fold == "fold")
            do {
                count = 0;
                for(var i = (res_arr.length -3); i >= 0; i--){
                    if((res_arr[i] == "fold") &&
                        ((res_arr[i+1] == 'c') || (typeof res_arr[i+1] == "object")) &&
                        ((res_arr[i+2] == 'c') || (typeof res_arr[i+2] == "object")) &&
                        ((res_arr[i+3] == 'c') || (typeof res_arr[i+3] == "object"))
                        ){
                        var part_arr = ['fold', res_arr[i+1], res_arr[i+2], ['lambda', ['x2', 'x3'], res_arr[i+3]]];;
                        console.log(part_arr);
                        res_arr[i] = part_arr;
                        res_arr.splice(i+1,3);
                        count++;
                        total_count++;
                    }
                }
            }
            while(count > 0)
        //var start_arr = ['lambda', 'x'];
    }
    while(total_count)
    res_arr.splice(0,0,'lambda', 'x');
    return res_arr;
}



function get_templates(size,templates,use_fold){
    var suffix = '';
    if((use_fold != undefined) && (use_fold == 'fold')){
        suffix = '_f_';
    }
    else if((use_fold != undefined) && (use_fold == 'tfold')){
        suffix = '_tf_';
    }
    var filename = '../train/data'+suffix+size +'.txt';
    if(fs.existsSync(filename)) {
        var data = fs.readFileSync(filename);

        console.log(data.toString());
        var file_text = data.toString();
        var file_arr=file_text.split("\n");
        var s='';
        while((str = file_arr.pop()) != undefined){
            var reg = /\d/;

            if(reg.test(str[0])){
                var sub_str = str.split(" --- ");
                var temp_arr = sub_str[1].split(",");
                var template = {count: parseInt(sub_str[0]), template_str: sub_str[1], template_arr: temp_arr, lisp_arr: get_lisp_format(temp_arr, use_fold) };
                templates.push(template);
                //console.log(template.count);
                console.log(template.template_str);
                //console.log(template.template_arr);
                console.log(template.lisp_arr);
            }
        }
    }
    return templates;
}



function get_next_template(size, use_fold){

    if((store_templates.size != size) || (store_templates.use_fold != use_fold)){
        var templates = [];
        templates = get_templates(size,[], use_fold);

        store_templates.size = size;
        store_templates.templates = [];
        store_templates.use_fold = use_fold;
        for(var i = 0; i < templates.length; i++){
            store_templates.templates[i]=templates[i].lisp_arr;
            //console.log(templates[i].template_arr);
        }
    }
    //return store_templates.templates;

    if(store_templates.templates.length)
        return store_templates.templates.pop();
    else
        return false;

}

module.exports = {
    get_templates: get_templates,
    get_next_template: get_next_template

}