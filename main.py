import cv2  
from utils import *
from sympytest import *

image = cv2.imread('eq.png')  
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
        elif row['exp']==1 and prev_exp==1:
            arr.append(str(symbol(pred)))
            data[i].at[index,'pred'] = symbol(pred)
        elif row['exp']!=1 and prev_exp==1:
            arr.append(")")
        
        if row['exp']==2:
            data[i].at[index,'pred'] = "-"
            arr.append("-")
        elif row['exp']==3:
            data[i].at[index,'pred'] = "="
            arr.append("=")
        elif row['exp']==0:
            if (prev_pred in variables or prev_pred in numbers) and (str(symbol(pred)) in variables or str(symbol(pred)) in numbers):
               arr.append("*") 
            arr.append(str(symbol(pred)))
            data[i].at[index,'pred'] = symbol(pred)
        prev_exp = row['exp']
        prev_pred = str(symbol(pred))
        cv2.putText(image, str(symbol(pred)), (row['X1'], row['Y1']), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2)
    string_list.append("".join(arr))

print([x.lower() for x in string_list])
for i in range(len(string_list)):
    if string_list[i][-1]=='=':
        res = solution(string_list[i][:-1])
        string_list[i]+=str(res[i]*(-1))
        
print("Equation string", string_list)
print(data)
cv2.imshow("Result45",image)
cv2.waitKey(0)

        