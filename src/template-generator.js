'use strict';

var expr_size = require('../src/expr_size.js');


// TODO add support for 'fold' and 'tfold'
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

    expression = next_template(len - 1, crumbs && crumbs[1]);

    if (!expression)
        return null;

    return ['op1', expression];
}

function next_op2(len, crumbs) {
    var e1, e2, e1_len, e2_len;

    if (!len || len < 3)
        return null;

    e1 = crumbs && crumbs[1] || next_template(1);
    e1_len = expr_size(e1);
    e2 = next_template(len - e1_len - 1, crumbs && crumbs[2]);

    if (!e2) {
        e1_len += 1;

        if (e1_len > (len - 1) / 2)
            return null;

        e1 = next_template(e1_len, crumbs && crumbs[1]);
        if (!e1)
            return null;

        e2 = next_template(len - e1_len - 1);
    }

    return ['op2', e1, e2];

}

function next_if0(len, crumbs) {
        var e1, e2, e3, e1_len, e2_len;

        if (!len || len < 4)
            return null;

        e1 = crumbs && crumbs[1] || next_template(1);
        e1_len = expr_size(e1);

        e2 = crumbs && crumbs[2] || next_template(1);
        e2_len = expr_size(e2);

        e3 = next_template(len - e1_len - e2_len - 1, crumbs && crumbs[3]);

        if (!e3) {
            e2_len += 1;

            if (e1_len + e2_len >= len - 1) {
                // reset e2 too
                e1_len += 1;
                if (e1_len >= len - 2)
                    return null;

                e1 = next_template(e1_len, crumbs && crumbs[1]);
                return next_if0(len, ['if0', e1, null, null]);
            }
            else {
                e2 = next_template(e2_len, crumbs && crumbs[2]);
                return next_if0(len, ['if0', e1, e2, null]);
            }

        }

        return ['if0', e1, e2, e3];
}


global.TEMPLATE_EXPRESSIONS = {
    c: next_c,
    op1: next_op1,
    op2: next_op2,
    if0: next_if0
};

//global.expressions = ['c', 'op1', 'op2', 'if', 'fold'];

global.expressions = ['c', 'op1', 'op2', 'if0'];

function next_template(len, crumbs) {
    var expression;
    var current;

    current = expressions.indexOf(crumbs && crumbs[0]);

    if (current === -1)
        current = 0;

    do {
        // we cannon build an expression of the specified length anymore
        if (current >= expressions.length)
            return null;

        // build expression tree for the next expression type
        expression = TEMPLATE_EXPRESSIONS[expressions[current]](len, crumbs);

        if (!expression) {
            current += 1;
            // old crumbs are not actual for new operator anymore
            crumbs = null;
        }

    } while(!expression);

    return expression;

};

module.exports = {
    next_template: next_template
}