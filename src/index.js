var Lexec = require('LISP.js').exec;
var Lparse = require('LISP.js').parse;

/*
calculate parsed node value
*/
function node_val(node)
{
  if(node instanceof Array)
	{
		switch(node[0])
		{
			case 'lambda': 
				return 1 + node_val(node[2]);
			case 'not': 
			case 'shl1': 
			case 'shr1': 
			case 'shr4': 
			case 'shr16': 
				return 1 + node_val(node[1]);
			case 'and': 
			case 'or': 
			case 'xor': 
			case 'plus': 
				return 1 + node_val(node[1]) + node_val(node[2]);
			case 'if0': 
				return 1 + node_val(node[1]) + node_val(node[2]) + node_val(node[3]);
			case 'fold': 
				return 2 + node_val(node[1]) + node_val(node[2]) + node_val(node[3][2]);
		}
	}
	return 1;	
}

var expr = "(lambda (x_78631) (fold (shr1 (xor (shl1 (or (or (if0 (and x_78631 (shl1 (shl1 (and (shr16 (and (shr4 x_78631) x_78631)) x_78631)))) 0 x_78631) x_78631) 0)) 0)) 1 (lambda (x_78632 x_78633) (xor (shr4 x_78632) x_78633))))";
console.log(node_val(Lparse(expr)) == 30);
