/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 09.08.13
 * Time: 19:44
 * To change this template use File | Settings | File Templates.
 */

function is_op_size(size, op_sizes){
    for(var i = 0; i < op_sizes.length; i++){
        if(op_sizes[i] == size)
            return true;
    }
    return false;
}

function conv_arr_to_str(a){
    var res = '';
    for(var i = 0; i < a.length; i++){
        res += a[i]+' ';
    }
    return res;
}

function get_patterns_s2(op_sizes,number){
    var res = {str:[], arr:[]};
    if(is_op_size(2, op_sizes)){
        res.push(['const']);
        res.push(['x']);
    }
    if(number != null && number !== undefined)
        return (number < res.length) ? res[number] : false;
    else
        return (res.length > 0) ? res : false;
}


function get_patterns_s3(op_sizes, number){
    var res = [];
    if(is_op_size(2, op_sizes)){
        res.push(['op1', 'const']);
        res.push(['op1', 'x']);

    }
    if(number != null && number !== undefined)
        return (number < res.length) ? res[number] : false;
    else
        return (res.length > 0) ? res : false;
}


function get_patterns_s4(op_sizes, number){
    var res = [];
    if(is_op_size(2, op_sizes)){
        res.push(['op1', 'op1', 'const']);
        res.push(['op1', 'op1', 'x']);
    }
    if(is_op_size(3, op_sizes)){
        res.push(['op2', 'x', 'x']);
        res.push(['op2', 'x', 'const']);
        res.push(['op2', 'const', 'const']);
    }
    if(number != null && number !== undefined)
        return (number < res.length) ? res[number] : false;
    else
        return (res.length > 0) ? res : false;
}

function get_patterns_s5(op_sizes, number){
    var res = [];
    if(is_op_size(2, op_sizes)){
        res.push(['op1', 'op1', 'op1', 'const']);
        res.push(['op1', 'op1', 'op1', 'x']);
    }
    if(is_op_size(3, op_sizes) && is_op_size(2, op_sizes)){
        res.push(['op2', 'op1', 'x', 'x']);
        res.push(['op2', 'op1', 'x', 'const']);
        res.push(['op2', 'op1', 'const', 'const']);
        res.push(['op1', 'op2', 'x', 'x']);
        res.push(['op1', 'op2', 'x', 'const']);
        res.push(['op1', 'op2', 'const', 'const']);
    }
    if(is_op_size(4, op_sizes)){
        res.push(['op3', 'x', 'x', 'x']);
        res.push(['op3', 'x', 'x', 'const']);
        res.push(['op3', 'x', 'const', 'const']);
        res.push(['op3', 'const', 'const', 'const']);
    }
    if(number != null && number !== undefined)
        return (number < res.length) ? res[number] : false;
    else
        return (res.length > 0) ? res : false;
}

function get_patterns_s8(size,op_sizes, number){
    var size_dist = size - 5;
    var dist_pattern = [];
    var main_pattern = [];
    var res = [];
    var k = 0;
    while(main_pattern = get_arr_pattern(5,op_sizes, k)){
        var j = 0;
        while(j < 4){
            /*
             if((j < 3) && (main_pattern[j] == 'x') && (main_pattern[j+1] == 'x')){
             i=0;
             while( dist_pattern = get_arr_pattern(size_dist+3,op_sizes, i)){
             var start_arr = main_pattern.slice(0,j);

             if(j < 3)
             res.push(start_arr.concat(dist_pattern,main_pattern.slice(j + 2)));
             else
             res.push(start_arr.concat(dist_pattern));
             i++;
             }
             j++;
             }
             else */
            if(main_pattern[j] == 'x'){
                i=0;
                while( dist_pattern = get_arr_pattern(size_dist+2,op_sizes, i)){
                    var start_arr = main_pattern.slice(0,j);

                    if(j < 3)
                        res.push(start_arr.concat(dist_pattern,main_pattern.slice(j + 1)));
                    else
                        res.push(start_arr.concat(dist_pattern));
                    i++;
                }
            }
            j++;
        }
        k++;
    }
    if(number != null && number !== undefined)
        return (number < res.length) ? res[number] : false;
    else
        return (res.length > 0) ? res : false;
}

function get_patterns_s15(size,op_sizes, number){
    var size_dist = size - 8;
    var dist_pattern = [];
    var main_pattern = [];
    var res = [];
    var k = 0;
    while(main_pattern = get_arr_pattern(8,op_sizes, k)){
        var j = 0;
        while(j < 7){
            /*
            if((j < 3) && (main_pattern[j] == 'x') && (main_pattern[j+1] == 'x')){
                i=0;
                while( dist_pattern = get_arr_pattern(size_dist+3,op_sizes, i)){
                    var start_arr = main_pattern.slice(0,j);

                    if(j < 3)
                        res.push(start_arr.concat(dist_pattern,main_pattern.slice(j + 2)));
                    else
                        res.push(start_arr.concat(dist_pattern));
                    i++;
                }
                j++;
            }
            else */
            if(main_pattern[j] == 'x'){
                i=0;
                while( dist_pattern = get_arr_pattern(size_dist+2,op_sizes, i)){
                    var start_arr = main_pattern.slice(0,j);

                    if(j < 3)
                        res.push(start_arr.concat(dist_pattern,main_pattern.slice(j + 1)));
                    else
                        res.push(start_arr.concat(dist_pattern));
                    i++;
                }
            }
            j++;
        }
        k++;
    }
    if(number != null && number !== undefined)
        return (number < res.length) ? res[number] : false;
    else
        return (res.length > 0) ? res : false;
}

function get_arr_pattern(size, op_sizes, pattern_num){
    var res = false;
    if((size > 8) && (size < 15)){
        res = get_patterns_s15(size,op_sizes, pattern_num);
    }
    else if((size > 5) && (size < 9)){
        res = get_patterns_s8(size,op_sizes, pattern_num);
    }
    else if(size == 5){
        res = get_patterns_s5(op_sizes, pattern_num);
    }
    else if(size == 4){
        res = get_patterns_s4(op_sizes, pattern_num);
    }
    else if(size == 3){
        res = get_patterns_s3(op_sizes, pattern_num);
    }
    if(size == 2){
        res = get_patterns_s2(op_sizes, pattern_num);
    }
    return res;
}

function get_patterns(size, op_sizes, pattern_num){
    var expr_size = size - 1;
    var i = 0;
    var res = '';



        var r='';
    var arr_pat = get_arr_pattern(size,op_sizes, null)
        while(r = arr_pat.pop()){
            res += r.join(' ') + "\n";
            i++;
        }

    res += 'Count:' + i + "\n";
    return res;
}

module.exports = get_patterns;