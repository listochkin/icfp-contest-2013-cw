'use strict';

/*
get string representation of parsed s-expression
*/
function expr_str(s_expr)
{
	if(s_expr instanceof Array)
	{
		return '(' + s_expr.map(expr_str).join(' ') + ')';
	}
	return s_expr;
}

module.exports = expr_str;