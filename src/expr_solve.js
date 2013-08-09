'use strict';

/*
find solution for given task JSON
*/
var Lparse = require('LISP.js').parse;
var expr_eval = require('./expr_eval')

function dumb3_solver(sol)
{
	var op = sol['task']['operators'][0];
	sol['s_expr'] = ['lambda', ['x'], [op, 'x']];
	return sol;
}

function solution_passed(s_expr, args, res)
{
	for (var i in args)
	{
		if (res[i] != expr_eval(s_expr, args[i]))
		{
			return false;
		}
	}
	return true;
}

function dumb4_solver(sol)
{
	var ops1 = ['not', 'shl1', 'shr1', 'shr4', 'shr16'];
	var ops2 = ['and', 'or', 'xor', 'plus', 'shr16'];

	var op = sol['task']['operators'][0];

	// small train set

	var test_s_expr = Lparse(sol['task']['challenge']);
	var test_args = [0, 1, 2, 3];
	var test_res = test_args.map(function(arg){return expr_eval(test_s_expr, arg);});
	//
	var s_expr = [];
	var variants = [0, 1, 'x'];

	if (ops2.indexOf(op) > -1)
	{
		for (var v1 in variants)
		{
			for (var v2 in variants)
			{
				s_expr = ['lambda', ['x'], [op, variants[v1], variants[v2]]];
				if (solution_passed(s_expr, test_args, test_res))
				{
					sol['s_expr'] = s_expr;
					return sol;
				}
			}
		}
	}else if(ops1.indexOf(op) > -1)
	{
		for (var v1 in variants)
		{
			s_expr = ['lambda', ['x'], [op, [op, variants[v1]]]];
			if (solution_passed(s_expr, test_args, test_res))
			{
				sol['s_expr'] = s_expr;
				return sol;
			}
		}
	}

	sol['s_expr'] = s_expr;
	return sol;
}

function expr_solve(JSONTask)
{
	var solution = {'task': JSONTask, 's_expr': [] };
	if (JSONTask["size"] == 3)
	{
		return dumb3_solver(solution);
	}
	if ((JSONTask["size"] == 4) && (JSONTask['operators'].length == 1))
	{
		console.log(JSONTask['operators'].length == 1);
		return dumb4_solver(solution);
	}
	return solution;
}

module.exports = expr_solve;