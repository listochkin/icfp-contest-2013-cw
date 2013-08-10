
/*

hole {
    tag: value;
}

 */




function toProgram(template, variables) {
    var index = 0;

    var mapper = function mapTemplate(template) {
        if (template instanceof Array) {
            return template.map(mapTemplate);
        }
        if (template === 'op1' ||
            template === 'op2' ||
            template === 'c' ) {

            var v = variables[index];
            index += 1;
            return v;
        }
        return template;
    }

    return mapper(template);

}

/*
 Maps Z3 operators and constants to BV ones
 */
function mapZ32BV (operator) {
   switch (operator) {
       case 'C0': return '0';
       case 'C1': return '1';
       case 'VAR': return 'x';
       default: return operator.toLowerCase();
   }
}

/*
 The function extracts suggested by z3 variables values.
 z3 output is given in the format:

 var z3Out = '(model                  \
 (define-fun h2 () Op1Type            \
 SHL1)                                \
 (define-fun h3 () Op2Type            \
 OR)                                  \
 (define-fun h1 () Op2Type            \
 PLUS)                                \
 (define-fun h4 () Op0Type            \
 C1)                                  \
 (define-fun h6 () Op0Type            \
 VAR)                                 \
 (define-fun h5 () Op0Type            \
 VAR)                                 \
 )';
 */

function extractVariables(z3OutExpression) {
    var i = 0;
    var variables = [];

    var extractor = function extract(expression) {
        var i;

        if (expression.length === 0)
            return;

        if (expression[0] === 'define-fun')  {
            index = new Number(expression[1].substr(1));
            value = expression[4];

            variables[index] = value;
        }

        for (i = 0; i <= expression.length; i += 1) {
            if (expression[i] instanceof Array)
                extract(expression[i]);

        }
    }

    extractor(z3OutExpression);
    return variables.map(mapZ32BV);
}

module.exports = {
    toProgram: toProgram,
    extractVariables: extractVariables
}