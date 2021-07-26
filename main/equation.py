import cv2
from numpy.core.fromnumeric import var  
from main.utils import *

def equation(image):

    # Getting dataframe of predictions and their image ROIs
    data = get_roi(image)

    # Global variables for checking type of symbol
    numbers = list(map(str, range(10)))
    special = ['log', 'sin', 'cos', 'tan']
    variables = ['m', 'r', 'x', 'y']
    operators = ['+', '-']
    constants = ['e', 'pi']
    graphing = ['>', '<', 'neq']

    # Creating empty lists for returning in django
    string_list = []
    res_list = []
    latex_list = []

    '''
    Looping through dataframes (equations)
    '''
    for i in range(len(data)):

        # Creating block variables        
        arr = []
        prev_exp = 0
        prev_pred = ''
        special_flag = False

        '''
        Looping through data frame rows (symbols)
        '''
        for index, row in data[i].iterrows():  

            # Getting ROI of symbol and preprocessing it
            roi = image[row['Y1']:row['Y2'], row['X1']:row['X2']]        
            pred = process(roi)

            '''
            Beginning of string formation conditions
            '''
            #---------------------------------------------------------------- exp = 1 ----------------------------------------------------------------#
            # Checking if plus is falsely exponentiated
            if row['exp']==1 and symbol(pred)=='+':                                 
                arr.append(str(symbol(pred)))
                data[i].at[index,'exp'] = '0'
                data[i].at[index,'pred'] = symbol(pred)

            # Adding the exponent start symbol (python)
            elif row['exp'] == 1 and prev_exp!=1:
                arr.append('**(')
                # Exception case for 1 as it has exp=5 and not exp=0
                if row['ones']==1:
                    arr.append('1')
                    data[i].at[index,'pred'] = 1
                else:
                    arr.append(str(symbol(pred)))
                    data[i].at[index,'pred'] = symbol(pred)
                # Exponent end symbol if it is the last index
                if index == len(data[i])-1:
                    arr.append(')')

            # Contition for passing numbers when part of exponent
            elif row['exp']==1 and prev_exp==1:
                # Exception case for 1 as it has exp=5 and not exp=0
                if row['ones']==1:
                    arr.append('1')
                    data[i].at[index,'pred'] = 1
                else:
                    arr.append(str(symbol(pred)))
                    data[i].at[index,'pred'] = symbol(pred)
                # Exponent end symbol if it is the last index   
                if index == len(data[i])-1:
                    arr.append(')')

            # Exponent end symbol if current number is not an exponent but previous was
            elif row['exp']!=1 and prev_exp==1:
                arr.append(')')

            #---------------------------------------------------------------- exp = 2 ----------------------------------------------------------------#
            # Adding minus sign
            if row['exp']==2:
                data[i].at[index,'pred'] = '-'
                # Adding special functions' closing bracket 
                if special_flag:
                    arr.append(')')
                    special_flag==False
                arr.append('-')

            #---------------------------------------------------------------- exp = 3 ----------------------------------------------------------------#
            # Adding equal sign
            elif row['exp']==3:
                data[i].at[index,'pred'] = '='
                # Adding special functions' closing bracket
                if special_flag:
                    arr.append(')')
                    special_flag=False
                arr.append('=')

            #---------------------------------------------------------------- exp = 4 ----------------------------------------------------------------#   
            # Adding point symbol 
            elif row['exp']==4:
                data[i].at[index,'pred'] = '.'
                arr.append('.')

            #---------------------------------------------------------------- exp = 5 ----------------------------------------------------------------# 
            # Adding 1   
            elif row['exp']==5:
                data[i].at[index,'pred'] = '1'
                # Adding special functions' closing bracket
                if prev_pred in special:
                    special_flag = True
                    arr.append('(')    
                arr.append('1')

            #---------------------------------------------------------------- exp = 0 ----------------------------------------------------------------#    
            elif row['exp']==0:
                '''
                Checking if multiplication symbol needs to be added or not:
                Conditions:-
                    current:'variable' AND previous:'variable' or 'number'
                    current:'number' AND previous:'variable' 
                    current:'special' or 'constant AND previous:'variable' or 'number'
                '''
                if (((str(symbol(pred))) in variables and prev_pred in variables+numbers) or ((str(symbol(pred))) in numbers and prev_pred in variables) or (str(symbol(pred))) in special+constants and prev_pred in variables+numbers):
                    arr.append('*') 

                # Adding special functions' opening bracket
                if prev_pred in special:
                    special_flag = True
                    arr.append('(')              
                
                if symbol(pred)=='neq':
                    arr.append('\\')

                # Appending prediction after prefix checks      
                arr.append(str(symbol(pred)))

                # Checking if special function needs to be closed
                if (special_flag==True and (symbol(pred) in operators+graphing)):
                    arr.pop()
                    arr.append(')')     
                    arr.append(str(symbol(pred)))                               
                    special_flag = False
                
                # Optional value replacement for 'e'
                # if str(symbol(pred))=='e':
                #     arr.pop()
                #     arr.append('2.718')                   

                #  Adding prediction to dataframe           
                data[i].at[index,'pred'] = symbol(pred)
            
            # Checking if special function needs to be closed if it is last element
            if (index == len(data[i])-1 and special_flag==True):
                arr.append(')')

            # Setting previous exp and prediction
            prev_exp = data[i].at[index,'exp']                                                    
            prev_pred = data[i].at[index,'pred']

            # Putting text in image
            if row['exp'] in [0,1]:
                cv2.putText(image, str(symbol(pred)), (row['X1'], row['Y1']), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2)

        # Joining strings and appending to final list string
        string_list.append(''.join(arr))

    print(data)
    

    '''
    Looping through equations (strings)
    '''
    for i in range(len(string_list)):

        #---------------------------------------------------------------- Case 1 - Equal in equation ----------------------------------------------------------------# 
        if '=' in list(string_list[i]):
            #--------------------------------- Case 1.1 - One variable ---------------------------------#
            if len(list(set(string_list[i]) & set(variables)))==1:

                # Condition to format when equal is not the last symbol
                if string_list[i][-1]!='=':
                    # Splitting string at equal
                    string_split = string_list[i].split('=')
                    # Bringing the RHS to LHS
                    new_string = string_split[0]+'-('+string_split[1]+')'
                    print('Equation predicted:', string_list[i])
                    # Calling calculation function to get variable value
                    res, var = one_variable(new_string)            
                    # Formatting result        
                    res_list.append(str(var) + ' = ' + str(res))
                    # Formatting to latex using function on RHS and LHS separately and adding '='
                    latex_list.append(string_to_latex(string_split[0])+'='+string_to_latex(string_split[1]))
                    print(str(var) + ' = ' + str(res))

                # Condition to format when equal is the last symbol
                else:
                    print('Equation predicted:', string_list[i])
                    # Slicing string to not include equal sign
                    res, var = one_variable(string_list[i][:-1])                    
                    res_list.append(str(var) + ' = ' + str(res))
                    # Formatting to latex and adding '=0'
                    latex_list.append(string_to_latex(string_list[i][:-1])+'=0')
                    print(str(var) + ' = ' + str(res))
            
            #--------------------------------- Case 1.2 - Two variables --------------------------------#
            elif len(list(set(string_list[i]) & set(variables)))==2:
                string_split = string_list[i].split('=')
                print('Equation predicted:', string_list[i])
                res_list.append('Multiple variables')
                latex_list.append(string_to_latex(string_split[0])+'='+string_to_latex(string_split[1]))

            #---------------------------- Case 1.3 - More than two variables ----------------------------#
            else:
                print('More than two variables not supported')

        #-------------------------------------------------------------- Case 2 - Equal not in equation --------------------------------------------------------------#
        elif '=' not in list(string_list[i]) and len(list(set(string_list[i]) & set(graphing)))==0 and '\\neq' not in string_list[i]:
            #--------------------------------- Case 2.1 - No variables --------------------------------#
            if len(list(set(string_list[i]) & set(variables)))==0:
                # Brining constant to LHS of a custom equation to find value
                new_string = 'x-('+string_list[i]+')'
                # Calling function
                res = no_variables(new_string)
                print('Equation predicted:', string_list[i])
                res_list.append(str(res))
                latex_list.append(string_to_latex(string_list[i]))
                print('Result: ' + str(res))
            
            #------------------------ Case 2.2 - With variable but ONLY for special functions (To graph)-------------------------#
            elif any(x in string_list[i] for x in special):
                print('Equation predicted:', string_list[i])
                res_list.append('Graph plotted')
                latex_list.append(string_to_latex(string_list[i]))

        #----------------------------------------------------------- Case 2 - Graphing symbols in equation -----------------------------------------------------------#
        elif (len(list(set(string_list[i]) & set(graphing)))==1) or '\\neq' in string_list[i]:
            print('Graphing equation:', string_list[i])
            new_string = string_list[i]
            # Splitting string at the symbol
            if '\\neq' in string_list[i]:
                string_split = string_list[i].split('\\neq')
                op = '\\neq'
            else:
                string_split = string_list[i].split(str(set(string_list[i]) & set(graphing)))
                # Finding which symbol is in equation
                op = ''.join(set(string_list[i]) & set(graphing))
            string_split = string_list[i].split(op)
            res_list.append(new_string)
            latex_list.append(string_to_latex(string_split[0])+op+string_to_latex(string_split[1]))
            res_list.append('No result')
        
        #------------------------------------------------------------------- Case 3 - Default case -------------------------------------------------------------------#
        else:   
            print('Equation invalid:', string_list[i])
            res_list.append('Invalid')
            latex_list.append('Invalid')

    # List of dictionaries with equations and results
    return_dict_list = []
    for i, val in enumerate(string_list):
        return_dict_list.append({
            'equation': val.lower(),
            'result': res_list[i].lower(),
            'latex': latex_list[i].replace(' ', '')
        })
    # cv2.imshow('Result45',image)
    return image, return_dict_list

        