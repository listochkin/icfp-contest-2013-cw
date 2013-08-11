
var globals = { c : ['0', '1', 'x'], op1: ['not', 'shl1', 'shr1', 'shr4', 'shr16'],
    op2: ['and' , 'or', 'xor','plus'], if0: ['if0'], fold: ['fold']};

function replace_element(element){

    for(var i = 0; i < globals.op1.length; i++){
        if(globals.op1[i] == element)
            return 'op1';
    }
    for(var i = 0; i < globals.op2.length; i++){
        if(globals.op2[i] == element)
            return 'op2';
    }
    if(element[0] == 'x')
        return 'c';
    for(var i = 0; i < globals.c.length; i++){
        if(globals.c[i] == element)
            return 'c';
    }
    if(globals.if0[0] == element)
       return 'if0';
    if(globals.fold[0] == element)
        return 'fold';

}


module.exports = function(expr){
    var arr_expr = expr.split(/[\s()]/);
    var clean_arr =[];
    var output_arr = [];
    for(var i = 0; i<arr_expr.length; i++){
        if(arr_expr[i].length > 0)
            clean_arr.push(arr_expr[i]);
    }
    //clean_arr = clean_arr.slice(2);
    var elem;
    i = 2;
    while( i<clean_arr.length ){
        if(clean_arr[i] == 'lambda')
            i = i + 2;
        else if(elem = replace_element(clean_arr[i]))
            output_arr.push(elem);
        i++;
    }
    return output_arr;
}


//module.exports = get_template;