'use strict';

/*
find solution for given task JSON
*/

function dumb_solver(sol)
{
	var op = sol['task']['operators'][0];
	sol['s_expr'] = ['lambda', ['x'], [op, 'x']];
	return sol;
}

function expr_solve(JSONTask)
{
	var solution = {'task': JSONTask, 's_expr': [] };
	if (JSONTask["size"] == 3)
	{
		return dumb_solver(solution);
	}
	return solution;
}

module.exports = expr_solve;