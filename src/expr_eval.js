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
				// apply 1st variable
				var _env = {};
				_env[s_expr[1][0]] = env['_']
				// eval sub-expression
				return expr_apply(s_expr[2], _env);
			case 'not':
				return ~expr_apply(s_expr[2], env);
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
				var list = expr_apply(s_expr[1], env);
				var acc = expr_apply(s_expr[2], env);

				for (var i = 0; i < 8; i++)
				{
					var _env = env;
					_env[s_expr[3][1][0]] = list & 0xff;
					_env[s_expr[3][1][1]] = acc;

					acc = expr_apply(s_expr[3][2], _env);
					list = list >> 8;
				}
				return acc;
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
	var env = {"_": arg};
	return expr_apply(s_expr, env);
}

module.exports = expr_eval;