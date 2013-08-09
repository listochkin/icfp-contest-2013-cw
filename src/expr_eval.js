'use strict';


/*
calculate parsed s-expression for given value
*/

function expr_apply(s_expr, env)
{
/*
	var s = ""
	for (var k in env)
	{
		s += k + ":" + env[k] + ";"
	}
*/
	if (s_expr instanceof Array)
	{
		switch(s_expr[0])
		{
			case 'not':
				return ~expr_apply(s_expr[1], env);
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
		//console.log("=S=" + s_expr + '=' + env[s_expr] + '||' + s);
		return env[s_expr];
	}

	return s_expr;
}

function expr_eval(s_expr, arg)
{

	var env = {};
	env[s_expr[1][0]] = arg;
	return expr_apply(s_expr[2], env);
}

module.exports = expr_eval;
