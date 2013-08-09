'use strict';

/*
calculate parsed s-expression for given value
*/

function expr_apply(s_expr, env)
{
	if (s_expr instanceof Array)
	{
		switch(s_expr[0])
		{
			case 'lambda':
				// dump apply
				var env1 = env;
				env1[s_expr[1][0]] = env['_']
				// eval sub-expression
				return expr_apply(s_expr[2], env1);
			case 'not':
				return ~expr_apply(s_expr[2], env1);
			case 'shl1':
				return expr_apply(s_expr[1], env) << 1;
			case 'shr1':
				return expr_apply(s_expr[1], env) >> 1;
			case 'shr4':
				return expr_apply(s_expr[1], env) >> 4;
			case 'shr16':
				return expr_apply(s_expr[1], env) >> 16;
			case 'and':
				return expr_apply(s_expr[1], env) & expr_apply(s_expr[2], env);
			case 'or':
				return expr_apply(s_expr[1], env) | expr_apply(s_expr[2], env);
			case 'xor':
				return expr_apply(s_expr[1], env) ^ expr_apply(s_expr[2], env);
			case 'plus':
				return expr_apply(s_expr[1], env) + expr_apply(s_expr[2], env);
			case 'if0':
				if (expr_apply(s_expr[1], env) != 0)
					return expr_apply(s_expr[2], env);
				else
					return expr_apply(s_expr[3], env);
			case 'fold':
				// stub
				return 1;
		}
	}
	if (typeof s_expr === 'string')
	{
		// substitute value
		return env[s_expr];
	}
	return s_expr;
}

function expr_eval(s_expr, arg)
{
	// '_' is name of 1st applied arg
	// '__' is name of 2nd applied arg
	var env = {"_": arg};
	return expr_apply(s_expr, env);
}

module.exports = expr_eval;