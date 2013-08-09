'use strict';

/*
calculate parsed s-expression size
*/
function expr_size(s_expr)
{
  if(s_expr instanceof Array)
	{
		switch(s_expr[0])
		{
			case 'lambda': 
				return 1 + expr_size(s_expr[2]);
			case 'not': 
			case 'shl1': 
			case 'shr1': 
			case 'shr4': 
			case 'shr16': 
				return 1 + expr_size(s_expr[1]);
			case 'and': 
			case 'or': 
			case 'xor': 
			case 'plus': 
				return 1 + expr_size(s_expr[1]) + expr_size(s_expr[2]);
			case 'if0': 
				return 1 + expr_size(s_expr[1]) + expr_size(s_expr[2]) + expr_size(s_expr[3]);
			case 'fold': 
				return 2 + expr_size(s_expr[1]) + expr_size(s_expr[2]) + expr_size(s_expr[3][2]);
		}
	}
	return 1;	
}

module.exports = expr_size;