import cv2
from numpy.core.fromnumeric import var  
from main.utils import *

def equation(image):
    # image = cv2.imread('eq.png')  
    data = get_roi(image)

    numbers = list(map(str, range(10)))
    special = ['log', 'sin', 'cos', 'tan']
    variables = ['m', 'r', 'x', 'y']
    operators = ['+', '-']
    constants = ['e', 'pi']
    graphing = ['>', '<', 'neq']

    string_list = []
    res_list = []
    latex_list = []
    for i in range(len(data)):
        arr = []
        prev_exp = 0
        prev_pred = ""
        special_flag = False
        for index, row in data[i].iterrows():  
            roi = image[row['Y1']:row['Y2'], row['X1']:row['X2']]        
            pred = process(roi)
            if row['exp']==1 and symbol(pred)=="+":
                arr.append(str(symbol(pred)))
                data[i].at[index,'exp'] = "0"
                data[i].at[index,'pred'] = symbol(pred)
            elif row['exp'] == 1 and prev_exp!=1:
                arr.append("**(")
                if row['ones']==1:
                    arr.append('1')
                    data[i].at[index,'pred'] = 1
                else:
                    arr.append(str(symbol(pred)))
                    data[i].at[index,'pred'] = symbol(pred)
                if index == len(data[i])-1:
                    arr.append(")")
            elif row['exp']==1 and prev_exp==1:
                if row['ones']==1:
                    arr.append('1')
                    data[i].at[index,'pred'] = 1
                else:
                    arr.append(str(symbol(pred)))
                    data[i].at[index,'pred'] = symbol(pred)
                if index == len(data[i])-1:
                    arr.append(")")
            elif row['exp']!=1 and prev_exp==1:
                arr.append(")")
            if row['exp']==2:
                data[i].at[index,'pred'] = "-"
                if special_flag:
                    arr.append(')')
                    special_flag==False
                arr.append("-")
            elif row['exp']==3:
                data[i].at[index,'pred'] = "="
                if special_flag:
                    arr.append(')')
                    special_flag=False
                arr.append("=")
            elif row['exp']==4:
                data[i].at[index,'pred'] = "."
                arr.append(".")
            elif row['exp']==5:
                data[i].at[index,'pred'] = "1"
                if prev_pred in special:
                    special_flag = True
                    arr.append('(')    
                arr.append("1")
            elif row['exp']==0:
                if (((str(symbol(pred))) in variables and prev_pred in variables+numbers) or ((str(symbol(pred))) in numbers and prev_pred in variables) or (str(symbol(pred))) in special+constants and prev_pred in variables+numbers):
                    arr.append("*") 
                if prev_pred in special:
                    special_flag = True
                    arr.append('(')                    
                arr.append(str(symbol(pred)))
                if (index == len(data[i])-1 and special_flag==True) or (special_flag==True and (symbol(pred) in operators+graphing)):
                    arr.append(')')                                    
                    special_flag = False
                # if str(symbol(pred))=='e':
                #     arr.pop()
                #     arr.append('2.718')                
                data[i].at[index,'pred'] = symbol(pred)
            prev_exp = data[i].at[index,'exp']                                                    
            prev_pred = data[i].at[index,'pred']
            if row['exp'] in [0,1]:
                cv2.putText(image, str(symbol(pred)), (row['X1'], row['Y1']), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2)
        string_list.append("".join(arr))

    print(data)
    # print([x.lower() for x in string_list])
    for i in range(len(string_list)):
        if '=' in list(string_list[i]):
            if len(list(set(string_list[i]) & set(variables)))==1:
                if string_list[i][-1]!='=':
                    string_split = string_list[i].split("=")
                    new_string = string_split[0]+'-('+string_split[1]+')'
                    print("Equation predicted:", string_list[i])
                    res, var = one_variable(new_string)                    
                    res_list.append(str(var) + " = " + str(res))
                    latex_list.append(string_to_latex(string_split[0])+'='+string_to_latex(string_split[1]))
                    print(str(var) + " = " + str(res))
                else:
                    print("Equation predicted:", string_list[i])
                    res, var = one_variable(string_list[i][:-1])                    
                    res_list.append(str(var) + " = " + str(res))
                    latex_list.append(string_to_latex(string_list[i][:-1])+'=0')
                    print(str(var) + " = " + str(res))
            elif len(list(set(string_list[i]) & set(variables)))==2:
                string_split = string_list[i].split("=")
                print("Equation predicted:", string_list[i])
                res_list.append("Multiple variables")
                latex_list.append(string_to_latex(string_split[0])+'='+string_to_latex(string_split[1]))
            else:
                print("More than two variables not supported")


        elif '=' not in list(string_list[i]) and len(list(set(string_list[i]) & set(graphing)))==0:
            if len(list(set(string_list[i]) & set(variables)))==0:
                new_string = 'x-'+string_list[i]
                res = no_variables(new_string)
                print("Equation predicted:", string_list[i])
                res_list.append(str(res))
                latex_list.append(string_to_latex(string_list[i]))
                print("Result: " + str(res))
            elif any(x in string_list[i] for x in special):
                print("Equation predicted:", string_list[i])
                res_list.append('Graph plotted')
                latex_list.append(string_to_latex(string_list[i]))


        elif len(list(set(string_list[i]) & set(graphing)))==1:
            print("Equation invalid:", string_list[i])
            new_string = string_list[i]
            string_split = string_list[i].split(str(set(string_list[i]) & set(graphing)))
            op = ''.join(set(string_list[i]) & set(graphing))
            string_split = string_list[i].split(op)
            res_list.append(new_string)
            latex_list.append(string_to_latex(string_split[0])+op+string_to_latex(string_split[1]))
            res_list.append("No result")
        
        else:   
            print("Equation invalid:", string_list[i])
            res_list.append("Invalid")
            latex_list.append("Invalid")

    # List of dictionaries with equations and results
    return_dict_list = []
    for i, val in enumerate(string_list):
        return_dict_list.append({
            'equation': val.lower(),
            'result': res_list[i].lower(),
            'latex': latex_list[i].replace(" ", "")
        })
    # cv2.imshow("Result45",image)
    return image, return_dict_list

        