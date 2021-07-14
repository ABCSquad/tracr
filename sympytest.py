from sympy.solvers import solve
from sympy import Symbol

variables = ['A', 'b', 'C', 'd', 'e', 'f', 'G', 'H', 'M', 'N', 'R', 'S', 'X', 'i', 'j', 'k', 'l', 'o', 'p', 'q', 'u', 'v', 'w', 'y', 'z']

def one_variable(equation_string):
    equation_chars = [char for char in equation_string]
    # Get variable of equation
    var = [value for value in equation_chars if value in variables][0]
    var = Symbol(var)
    return solve(equation_string, var), var

def no_variables(equation_string):
    # Get variable of equation
    x = Symbol('X')
    return solve(equation_string, x)