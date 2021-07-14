from sympy.solvers import solve
from sympy import Symbol

variables = ['A', 'b', 'C', 'd', 'e', 'f', 'G', 'H', 'M', 'N', 'R', 'S', 'X', 'i', 'j', 'k', 'l', 'o', 'p', 'q', 'u', 'v', 'w', 'y', 'z']

def solution(equation_string):
    equation_chars = [char for char in equation_string]
    # Get variable of equation
    var = [value for value in equation_chars if value in variables][0]
    var = Symbol(var)
    print(str(var) + " = " + str(solve(equation_string, var)))
    return solve(equation_string, var)
