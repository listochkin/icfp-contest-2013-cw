'use strict';

var expr_size = require('../src/expr_size.js');


// TODO optimize 'fold'. Exclude cases of fold
//

function next_c(len, crumbs) {
    if (len != 1)
        return null;

    if (len === 1 && crumbs)
        return null;

    return 'c';
}

function next_op1(len, crumbs) {
    var expression;

    if (!len || len === 1)
        return null;

    // end of leaf reached, nothing to return anymore
    if (len === 2 && crumbs)
        return null;

    expression = next_expression(len - 1, crumbs && crumbs[1]);

    if (!expression)
        return null;

    return ['op1', expression];
}

function next_op2(len, crumbs) {
    var e1, e2, e1_len, e2_len;

    if (!len || len < 3)
        return null;

    e1 = crumbs && crumbs[1] || next_expression(1);
    e1_len = expr_size(e1);
    e2 = next_expression(len - e1_len - 1, crumbs && crumbs[2]);

    if (e2) {
        return ['op2', e1, e2];
    }

    e1 = next_expression(e1_len, crumbs && crumbs[1]);
    if (e1) {        
        
        e2 = next_expression(len - e1_len - 1);
        return ['op2', e1, e2];
    }

    e1_len += 1;
    
    //console.log('op2 here ' + e1_len);

    if (e1_len > (len - 1) / 2)
        return null;
    
    //console.log('op2 here2 ' + e1_len + ' ' + crumbs && crumbs[1] );
        
    
    e1 = next_expression(e1_len);
    if (!e1)
        return null;    
    
    //console.log('op2 here3 ' + e1_len);

    e2 = next_expression(len - e1_len - 1);
    
    return ['op2', e1, e2];

}


function next_ternary_expression(len, crumbs, operator, operator_len) {
    var e1, e2, e3, e1_len, e2_len;

    if (!len || len < 3 + operator_len)
        return null;

    e1 = crumbs && crumbs[1] || next_expression(1);
    e1_len = expr_size(e1);

    e2 = crumbs && crumbs[2] || next_expression(1);
    e2_len = expr_size(e2);

    e3 = next_expression(len - e1_len - e2_len - operator_len, crumbs && crumbs[3]);


    if (e3) {
        return [operator, e1, e2, e3];
    }

    // there are no more e3 of given len
    // let's reset e3 and get the next e2
    e2 = next_expression(e2_len, crumbs && crumbs[2]);

    if (e2) {
        e3 = next_expression(len - e1_len - e2_len - operator_len);
        return [operator, e1, e2, e3];
    }

    // there are no new e2 either. Let's increase e2 length and start over
    e2_len += 1;
    if (e1_len + e2_len < len - operator_len) {
        e2 = next_expression(e2_len);
        return next_ternary_expression(len, [operator, e1, e2, null], operator, operator_len);
    }

    // we ran out of e2's for e1. Let's get next e1
    e1 = next_expression(e1_len, crumbs && crumbs[1]);
    if (e1) {
        return next_ternary_expression(len, [operator, e1, null, null], operator, operator_len);
    }

    // start over e1 with the new len
    e1_len += 1;
    if (e1_len >= len - operator_len - 1)
        return null;

    e1 = next_expression(e1_len);
    return next_ternary_expression(len, [operator, e1, null, null], operator, operator_len);
}


function next_if0(len, crumbs) {
//    if (!len || len < 5 )
//        return null;

    return next_ternary_expression(len, crumbs, 'if0', 1);
}

function next_fold(len, crumbs) {
    if (!len || len < 6)
        return null;
    
    var fold_arguments = crumbs && ['fold', crumbs[1], crumbs[2], crumbs[3] && crumbs[3][2]];

    var next_arguments = next_ternary_expression(len, fold_arguments, 'fold', 2);

    return next_arguments &&
        ['fold', next_arguments[1], next_arguments[2], ['lambda', ['x2', 'x3'], next_arguments[3]]];

}

function next_tfold(len, current) {
    var expression;

    if (!len || len < 6)
        return null;

    expression = next_expression(len - 4, current && current[3] && current[3][2]);

    if (!expression)
        return null;

    return ['fold', 'x1', '0', ['lambda', ['x1', 'x2'], expression]];
}

var TEMPLATE_EXPRESSIONS = {
    c: next_c,
    op1: next_op1,
    op2: next_op2,
    if0: next_if0,
    fold: next_fold,
    tfold: next_tfold
};

var expressions = ['fold', 'if0', 'op2', 'op1', 'c'];

function next_expression(len, current, options) {
    var expression;
    var index;
    var fold_allowed = options && options.fold_allowed;
    var use_tfold = options && options.use_tfold;

    index = expressions.indexOf(current && current[0]);
   
    if (index === -1) {
        index = 0;
        
        if (expressions[index] === 'fold' && !fold_allowed)
            index += 1;
        /*if ((!isOp2 && expressions[index] === 'op2')) {
            index++;
        }*/
    }

    do {
        // we cannon build an expression of the specified length anymore
        if (index >= expressions.length)
            return null;
        
        
        var expressionName = expressions[index];
        if (expressionName === 'fold' && use_tfold)
            expressionName = 'tfold';

        // build expression tree for the next expression type
        expression = TEMPLATE_EXPRESSIONS[expressionName](len, current);
        
        
        //console.log(expression);

        if (!expression) {
            // old expressions are not actual for new operator anymore
            current = null;

            index += 1;
            if (expressions[index] === 'fold' && !fold_allowed)
                index += 1;            
            //if ((!isOp1 && expressions[index] === 'op1') || (!isOp2 && expressions[index] === 'op2') || (!isIf && expressions[index] === 'if0')) {
                //index++;
            //}
        }
        

    } while(!expression);
    
    return expression;

};

var pool;
pool = [
    ["lambda",["x1"],["op1",["op1",["op1","c"]]]],
    ["lambda",["x1"],["op2","c",["op1","c"]]],
    ["lambda",["x1"],["op1",["op2","c","c"]]],
    ["lambda",["x1"],["op1",["op1",["op1","c"]]]],
    ["lambda",["x1"],["op2","c",["op1","c"]]],
    ["lambda",["x1"],["op1",["op2","c","c"]]],

    ["lambda",["x1"],["op1",["op1",["op1",["op1","c"]]]]],
    ["lambda",["x1"],["op2","c",["op2","c","c"]]],
    ["lambda",["x1"],["op2","c",["op1",["op1","c"]]]],
    ["lambda",["x1"],["op2",["op1","c"],["op1","c"]]],
    ["lambda",["x1"],["op1",["op2","c",["op1","c"]]]],
    ["lambda",["x1"],["op1",["op1",["op2","c","c"]]]],
    ["lambda",["x1"],["op1",["op1",["op1",["op1","c"]]]]],
    ["lambda",["x1"],["op2","c",["op2","c","c"]]],
    ["lambda",["x1"],["op2","c",["op1",["op1","c"]]]],
    ["lambda",["x1"],["op2",["op1","c"],["op1","c"]]],
    ["lambda",["x1"],["op1",["op2","c",["op1","c"]]]],
    ["lambda",["x1"],["op1",["op1",["op2","c","c"]]]],

    ["lambda",["x1"],["op1",["op1",["op1",["op1",["op1","c"]]]]]],
    ["lambda",["x1"],["op2","c",["op2","c",["op1","c"]]]],
    ["lambda",["x1"],["op2","c",["op1",["op2","c","c"]]]],
    ["lambda",["x1"],["op2","c",["op1",["op1",["op1","c"]]]]],
    ["lambda",["x1"],["op2",["op1","c"],["op2","c","c"]]],
    ["lambda",["x1"],["op2",["op1","c"],["op1",["op1","c"]]]],
    ["lambda",["x1"],["op1",["op2","c",["op2","c","c"]]]],
    ["lambda",["x1"],["op1",["op2","c",["op1",["op1","c"]]]]],
    ["lambda",["x1"],["op1",["op2",["op1","c"],["op1","c"]]]],
    ["lambda",["x1"],["op1",["op1",["op2","c",["op1","c"]]]]],
    ["lambda",["x1"],["op1",["op1",["op1",["op2","c","c"]]]]],
    ["lambda",["x1"],["op1",["op1",["op1",["op1",["op1","c"]]]]]],
    ["lambda",["x1"],["op2","c",["op2","c",["op1","c"]]]],
    ["lambda",["x1"],["op2","c",["op1",["op2","c","c"]]]],
    ["lambda",["x1"],["op2","c",["op1",["op1",["op1","c"]]]]],
    ["lambda",["x1"],["op2",["op1","c"],["op2","c","c"]]],
    ["lambda",["x1"],["op2",["op1","c"],["op1",["op1","c"]]]],
    ["lambda",["x1"],["op1",["op2","c",["op2","c","c"]]]],
    ["lambda",["x1"],["op1",["op2","c",["op1",["op1","c"]]]]],
    ["lambda",["x1"],["op1",["op2",["op1","c"],["op1","c"]]]],
    ["lambda",["x1"],["op1",["op1",["op2","c",["op1","c"]]]]],
    ["lambda",["x1"],["op1",["op1",["op1",["op2","c","c"]]]]]
];

var globalSize = 0;
var globalLen = 0;
var globalCount = 0;

function next_program(len, current, operators) {

    if (!globalLen) {
        globalLen = len;
        globalSize = (len < 5) ? len : 5;
        globalCount = 0;
    }

    if (globalCount >= 200) {
        globalSize = 0;
        globalLen = 0;
        globalCount = 0;
        return null;
    }

    var program = next_program_exact_size(globalSize, current, operators);

    if (program) {
        globalCount += 1;
        return program;
    }

    globalSize += 1;

    if (globalSize > globalLen)
        return null;

    program = next_program(globalSize, null, operators);
    if (!program) {
        globalSize = 0;
        globalLen = 0;
        globalCount = 0;
        return null;
    }

    globalCount += 1;

    return program;

}


function next_program_from_pool(len, current, operators) {

    var index;

    index = pool.indexOf(current) + 1;

    return pool[index] || null;
}

var insider_parser = require('../src/training_parser.js');

function next_program_insider(len, current, operators) {

    insider_parser.get_next_template(len);
}

function next_program_exact_size(len, current, operators) {
    
    if(typeof(operators) === 'undefined')
        operators = [ 'xor', 'plus', 'and', 'or', 'not', 'shl1', 'shr1', 'shr16', 'shr4'/*, 'fold', 'if0' */];
        
    var isOp1 = false;
    var isOp2 = false;
    var isIf = false;
    var isFold = false;

    var useTFoldInsteadOfFold = false;
    
    for (var i = 0; i < operators.length; i++) {
        switch(operators[i])
        {
            case 'not':
            case 'shl1':
            case 'shr1':
            case 'shr4':
            case 'shr16':
                isOp1 = true;
                break
            case 'and':
            case 'or':
            case 'xor':
            case 'plus':
                isOp2 = true;
                break
            case 'if0':
                isIf = true;
                break
            case 'fold':
//                isFold = true;
                break
            case 'tfold':
//                isFold = true;
//                useTFoldInsteadOfFold = true;
                break;
        }
    }
    
    var expression = current && current[2];
    var options = {
        fold_allowed: isFold,
        use_tfold: useTFoldInsteadOfFold
    };

    if (!len || len < 2)
        return null;

    function post_check(s_expr) {
        
        if(s_expr instanceof Array) {
            
            for (var i = 0; i < s_expr.length; i++) {
                
                if(s_expr[i] instanceof Array) 
                    post_check(s_expr[i]);
                else {                    
                    switch(s_expr[i])
                    {
                        case 'op1':                        
                            isGotOp1 = true;                            
                            break;
                        case 'op2':                        
                            isGotOp2 = true;
                            break;
                        case 'if0':
                            isGotIf = true;
                            ifCount += 1;
                            break;
                        case 'fold':
                            isGotFold = true;
                            break;
//                        case 'c':
//                            cCount += 1;
//                            break;
                    }
                }
            }
        }
    }
    
    do {
        expression = next_expression(len - 1, expression, options);
        
        var isGotOp1 = false;
        var isGotOp2 = false;
        var isGotIf = false;
        var isGotFold = false;
        var ifCount = 0;
        var cCount = 0;

        post_check(expression);
    } while(expression && (/*(isIf && !isGotIf) ||*/ /*(isFold && !isGotFold) || *//*(isOp1 && !isGotOp1) ||*/
                           /*(isOp2 && !isGotOp2) ||*/ (!isOp1 && isGotOp1) || (!isOp2 && isGotOp2) ||
                           (!isIf && isGotIf) || (!isFold && isGotFold) || (ifCount > 2) //||
                           /*(isGotIf) || (isGotOp2)*/ ));
    
    
    if (!expression)
        return null;

    return ['lambda', ['x1'], expression];
}


module.exports = {
    next_program: next_program
}