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

    if (e2)
        return ['op2', e1, e2];

    e1 = next_expression(e1_len, crumbs && crumbs[1]);
    if (e1) {
        e2 = next_expression(len - e1_len - 1);
        return ['op2', e1, e2];
    }

    e1_len += 1;

    if (e1_len > (len - 1) / 2)
        return null;

    e1 = next_expression(e1_len, crumbs && crumbs[1]);
    if (!e1)
        return null;

    e2 = next_expression(len - e1_len - 1);
    return ['op2', e1, e2];

}

function next_trinary_expression(len, crumbs, operator, operator_len) {
    var e1, e2, e3, e1_len, e2_len;

    if (!len || len < 3 + operator_len)
        return null;

    e1 = crumbs && crumbs[1] || next_expression(1);
    e1_len = expr_size(e1);

    e2 = crumbs && crumbs[2] || next_expression(1);
    e2_len = expr_size(e2);

    e3 = next_expression(len - e1_len - e2_len - operator_len, crumbs && crumbs[3]);


    if (e3)
        return [operator, e1, e2, e3];

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
        return next_trinary_expression(len, [operator, e1, e2, null], operator, operator_len);
    }

    // we ran out of e2's for e1. Let's get next e1
    e1 = next_expression(e1_len, crumbs && crumbs[1]);
    if (e1) {
        return next_trinary_expression(len, [operator, e1, null, null], operator, operator_len);
    }

    // start over e1 with the new len
    e1_len += 1;
    if (e1_len >= len - operator_len - 1)
        return null;

    e1 = next_expression(e1_len);
    return next_trinary_expression(len, [operator, e1, null, null], operator, operator_len);
}


function next_if0(len, crumbs) {
    return next_trinary_expression(len, crumbs, 'if0', 1);
}

function next_fold(len, crumbs) {
    if (!len || len < 6)
        return null;

    return next_trinary_expression(len, crumbs, 'fold', 2);
}

function next_tfold(len, current) {
    var expression;

    if (!len || len < 6)
        return null;

    expression = next_expression(len - 4, current && current[2]);

    if (!expression)
        return null;

    return ['lambda', 'x', '0', expression];
}

function next_program(len, current) {
    var expression;
    var options = {
        fold_allowed : true
        //fold_allowed : false
    };

    if (!len || len < 2)
        return null;

    expression = next_expression(len - 1, current && current[2], options);

    if (!expression)
        return null;

    return ['lambda', 'x', expression];

}

global.TEMPLATE_EXPRESSIONS = {
    c: next_c,
    op1: next_op1,
    op2: next_op2,
    if0: next_if0,
    fold: next_fold,
    tfold: null //next_tfold
};

//global.expressions = ['c', 'op1', 'op2', 'if', 'fold'];

global.expressions = ['c', 'op1', 'op2', 'if0', 'fold'];

function next_expression(len, current, options) {
    var expression;
    var index;
    var fold_allowed = options && options.fold_allowed;

    index = expressions.indexOf(current && current[0]);

    if (index === -1)
        index = 0;

    do {
        // we cannon build an expression of the specified length anymore
        if (index >= expressions.length)
            return null;

        // build expression tree for the next expression type
        expression = TEMPLATE_EXPRESSIONS[expressions[index]](len, current);

        if (!expression) {
            // old expressions are not actual for new operator anymore
            current = null;

            index += 1;
            if (expressions[index] === 'fold' && !fold_allowed)
                index += 1;
        }

    } while(!expression);

    return expression;

};

module.exports = {
    next_expression: next_expression,
    next_program: next_program
}