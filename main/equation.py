import cv2
from numpy.core.fromnumeric import var  
from main.utils import *

def equation(image):
    # image = cv2.imread('eq.png')  
    data = get_roi(image)

    numbers = list(map(str, range(10)))
    variables = ['A', 'b', 'C', 'd', 'e', 'f', 'G', 'H', 'M', 'N', 'R', 'S', 'X', 'i', 'j', 'k', 'l', 'o', 'p', 'q', 'u', 'v', 'w', 'y', 'z']
    operators = ['+', '-', 'div', 'times']

    string_list = []
    latex_list = []
    for i in range(len(data)):
        arr = []
        prev_exp = 0
        prev_pred = ""
        for index, row in data[i].iterrows():  
            roi = image[row['Y1']:row['Y2'], row['X1']:row['X2']]        
            pred = process(roi)
            if row['exp'] == 1 and prev_exp!=1:
                arr.append("**("+str(symbol(pred)))
                data[i].at[index,'pred'] = symbol(pred)
                if index == len(data[i])-1:
                    arr.append(")")
            elif row['exp']==1 and prev_exp==1:
                arr.append(str(symbol(pred)))
                data[i].at[index,'pred'] = symbol(pred)
                if index == len(data[i])-1:
                    arr.append(")")
            elif row['exp']!=1 and prev_exp==1:
                arr.append(")")
            
            if row['exp']==2:
                data[i].at[index,'pred'] = "-"
                arr.append("-")
            elif row['exp']==3:
                data[i].at[index,'pred'] = "="
                arr.append("=")
            elif row['exp']==4:
                data[i].at[index,'pred'] = "."
                arr.append(".")
            elif row['exp']==5:
                data[i].at[index,'pred'] = "1"
                arr.append("1")
            elif row['exp']==0:
                if prev_exp in [0,1] and (((str(symbol(pred))) in variables and prev_pred in variables+numbers) or ((str(symbol(pred))) in numbers and prev_pred in variables)):
                    arr.append("*") 
                arr.append(str(symbol(pred)))
                data[i].at[index,'pred'] = symbol(pred)
            prev_exp = row['exp']                                                       
            prev_pred = str(symbol(pred))
            if row['exp'] in [0,1]:
                cv2.putText(image, str(symbol(pred)), (row['X1'], row['Y1']), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2)
        string_list.append("".join(arr))

    print(data)
    # print([x.lower() for x in string_list])
    for i in range(len(string_list)):
        if '=' in list(string_list[i]) and len(list(set(string_list[i]) & set(variables)))==1:
            if string_list[i][-1]!='=':
                string_split = string_list[i].split("=")
                if (string_split[1][0]=='-'):
                    new_string = string_split[0]+"+"+string_split[1][1:]
                else:
                    new_string = string_split[0]+"-"+string_split[1]
                res, var = one_variable(new_string)
                print("Equation predicted:", string_list[i])
                print(str(var) + " = " + str(res))
            else:
                res, var = one_variable(string_list[i][:-1])
                print("Equation predicted:", string_list[i])
                print(str(var) + " = " + str(res))

        elif '=' not in list(string_list[i]) and len(list(set(string_list[i]) & set(variables)))==0:
            new_string = 'X-'+string_list[i]
            res = no_variables(new_string)
            print("Equation predicted:", string_list[i])
            print("Result: " + str(res))
        
        else:
            print("Equation invalid:", string_list[i])

    # cv2.imshow("Result45",image)
    return image

        