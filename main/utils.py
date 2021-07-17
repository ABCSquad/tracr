import cv2  
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from tensorflow import keras
from sympy.solvers import solve
from sympy import Symbol

# Global variables
dict_clean_img = {} #BINARY IMAGE DICTIONAY
dict_img = {} #ORIGINAL IMAGE DICTIONARY
variables = ['A', 'b', 'C', 'd', 'e', 'f', 'G', 'H', 'M', 'N', 'R', 'S', 'X', 'i', 'j', 'k', 'l', 'o', 'p', 'q', 'u', 'v', 'w', 'y', 'z']

# Loading model
try:
    model = keras.models.load_model('deModel_v3min')
except:
    print('Model could not be loaded')

# Function to sort contours
def sort_contours(cnts, method="left-to-right"):
    
    # Initialize the reverse flag and sort index
    reverse = False
    i = 0

    # If sorting is reversed
    if method == "right-to-left" or method == "bottom-to-top":
        reverse = True

    # handle if we are sorting against the y-coordinate rather than
    # the x-coordinate of the bounding box
    if method == "top-to-bottom" or method == "bottom-to-top":
        i = 1

    # List bounding boxes and sort them top to bottom
    boundingBoxes = [cv2.boundingRect(c) for c in cnts]
    (cnts, boundingBoxes) = zip(*sorted(zip(cnts, boundingBoxes),
        key=lambda b:b[1][i], reverse=reverse))

    # Returning sorted contours and bounding boxes
    return (cnts, boundingBoxes)

def find_good_contours_thres(conts, alpha = 0.002):

    # Calculating areas of contours in a list
    areas = []
    
    for c in conts:
        areas.append([cv2.contourArea(c)**2])
    # Alpha is controlling paramter    
    thres = alpha * max(areas)[0]
    
    return thres

def extract_line(image, beta=0.7, alpha=0.00001, show = True):
    
    img = image.copy()                                                                                  # Creating copy of the image

    # Converting image to gray
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Binary thresholding and inverting at 127
    th, threshed = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV|cv2.THRESH_OTSU)

    # Selecting elliptical element for dilation    
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(3,3))
    dilation = cv2.dilate(threshed,kernel,iterations = 1)

    # Saving a copy of dilated image for taking bitwise_and operation
    temp = dilation.copy()
    
    # Find the contours
    if(cv2.__version__ == '3.3.1'): 
        xyz,contours,hierarchy = cv2.findContours(dilation,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    else:
        contours,hierarchy = cv2.findContours(dilation,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)

    cont_thresh = find_good_contours_thres(contours, alpha=alpha)

    # Creating a mask of only ones    
    mask = np.ones(dilation.shape[:2], dtype="uint8") * 255

    # Drawing those contours which are noises and then taking bitwise and
    for c in contours:
        if( cv2.contourArea(c)**2 < cont_thresh):
            cv2.drawContours(mask, [c], -1, 0, -1)

    cleaned_img = cv2.bitwise_and(temp, temp, mask=mask)

    #Dilating the cleaned image for better detection of line in cases where
    #exponents are little up the line
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(3,3))
    dil_cleaned_img = cv2.dilate(cleaned_img,kernel,iterations = 10)

    #Getting back the cleaned original image without noise
    cleaned_orig = cv2.erode(cleaned_img, kernel, iterations=1) 

    ##Find and draw the upper and lower boundary of each lines
    hist = cv2.reduce(dil_cleaned_img,1, cv2.REDUCE_AVG).reshape(-1)

    th = 1
    H,W = img.shape[:2]
    uppers = np.array([y for y in range(H-1) if hist[y]<=th and hist[y+1]>th])
    lowers = np.array([y for y in range(H-1) if hist[y]>th and hist[y+1]<=th])

    diff_1 = np.array([j-i for i,j in zip(uppers,lowers)])
    diff_index_1 = np.array([True if j > beta*(np.mean(diff_1)-np.std(diff_1)) else False for j in diff_1 ])

    uppers = uppers[diff_index_1]
    lowers = lowers[diff_index_1]
    
    #Extending uppers and lowers indexes to avoid cutting of chars of lines
    #Extended more uppers by 33% as exponential might lie above 
    uppers[1:] = [i-int(j)/4 for i,j in zip(uppers[1:], diff_1[1:])]
    lowers[:-1] = [i+int(j)/5 for i,j in zip(lowers[:-1], diff_1[:-1])]

    diff_2 = np.array([j-i for i,j in zip(uppers,lowers)])
    diff_index_2 = np.array([True]*len(uppers))
    diff_index = diff_index_2

    cleaned_orig_rec = cv2.cvtColor(cleaned_orig, cv2.COLOR_GRAY2BGR)

    #For changing color of intermediate lines, keeping count
    col_ct = 0
    for left,right in zip(uppers[diff_index], lowers[diff_index]):
        #print(left,right)
        col1 = (153,255,255)
        col2 = (255,255,153)
        if(col_ct % 2 == 0):
            col= col1
        else: 
            col=col2
        cv2.rectangle(cleaned_orig_rec ,(0+10,left),(W-15,right),col,4)
        col_ct += 1
        
    if(show == True):   
        fig1 = plt.figure(figsize=(15,5))
        fig1.suptitle('Line Detection')
        ax1 = fig1.add_subplot(1,2,1)
        ax1.axis("off")
        ax1.imshow(cv2.cvtColor(cleaned_orig,cv2.COLOR_BGR2RGB))
        
        ax2 = fig1.add_subplot(1,2,2)    
        ax2.axis("off")
        ax2.imshow(cv2.cvtColor(cleaned_orig_rec, cv2.COLOR_BGR2RGB))
        
        # plt.show()
    
    return cleaned_orig, uppers[diff_index], lowers[diff_index]    

def text_segment(Y1,Y2,X1,X2,box_num,line_name, dict_clean = dict_clean_img,\
                 acc_thresh = 0.60, show = True):

    img = dict_clean[box_num][Y1:Y2,X1:X2].copy()
    L_H = Y2-Y1
    ## apply some dilation and erosion to join the gaps
    #Selecting elliptical element for dilation    
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(3,3))
    dilation = cv2.dilate(img,kernel,iterations = 2)
    erosion = cv2.erode(dilation,kernel,iterations = 1)

    # Find the contours
    if(cv2.__version__ == '3.3.1'):
        xyz,contours,hierarchy = cv2.findContours(erosion,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    else:
        contours,hierarchy = cv2.findContours(erosion,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)

    # Finding good contour threshold
    ct_th = find_good_contours_thres(contours, alpha=0.000001)
    cnts = []
    for c in contours:       
        if( cv2.contourArea(c)**2 > ct_th):
            cnts.append(c)
    
    # Sorting contours from left to right
    contours_sorted, bounding_boxes = sort_contours(cnts,method="left-to-right")
    
    
    img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

    i = 0
    char_type = []
    char_locs = []
    equal = False

    '''
    Meaning of exp integers
    exp = {0:'default', 1:'exponent', 2:'minus', 3:'equal', 4:'point', 5:'one'}
    '''
    # Iterating through sorted contours
    while i in range(0, len(contours_sorted)):
            # Get coordinates of current bounding box
            x,y,w,h = bounding_boxes[i]
            # Setting default char type to variable/number (exp=0)
            exp = 0

            # Combining contours too close to each other
            if i+1 != len(contours_sorted):
                x1,y1,w1,h1 = bounding_boxes[i+1]
                if abs(x-x1) < 10 and (h1+h) < 70 and h>w/3:
                    minX = min(x,x1)
                    minY = min(y,y1)
                    maxX = max(x+w, x1+w1)
                    maxY = max(y+h, y1+h1)
                    x,y,x11,y11 = minX, minY, maxX, maxY
                    x,y,w,h = x,y,x11-x,y11-y
                    i = i+2
                    continue

            if(h<0.10*L_H and w<0.10*L_H):
                exp = 4
                cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,255),2)
                char_type.append(exp)
                char_locs.append([x-2,y+Y1-2,x+w+1,y+h+Y1+1,w*h])
                i=i+1
                continue

            if(w<h/3) and (h>w*3):
                exp = 5
                cv2.rectangle(img,(x,y),(x+w,y+h),(153,180,255),2)
                char_type.append(exp)
                char_locs.append([x-2,y+Y1-2,x+w+1,y+h+Y1+1,w*h])
                i=i+1
                continue


            # Checking for equal sign using contour properties
            if(h<w/3) and equal==False:
                if i+1 != len(contours_sorted):
                    x1,y1,w1,h1 = bounding_boxes[i+1]
                    if(h1<w1/3):
                        exp = 3
                        cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)
                        cv2.rectangle(img,(x1,y1),(x1+w1,y1+h1),(0,0,255),2)
                        char_type.append(exp)
                        char_locs.append([x-2,y+Y1-2,x+w+1,y+h+Y1+1,w*h])
                        equal=True
                        i=i+2
                        continue
                    else:
                        #char_locs.append([x,y,x+w,y+h])     
                        exp = 2
                        cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,255),2)
                        char_type.append(exp)
                        char_locs.append([x-2,y+Y1-2,x+w+1,y+h+Y1+1,w*h])
                        # print("Minus")
                        i=i+1
                        continue

            


            char_locs.append([x-2,y+Y1-2,x+w+1,y+h+Y1+1,w*h]) #Normalised location of char w.r.t box image
            
            cv2.rectangle(img,(x,y),(x+w,y+h),(153,180,255),2)
            if i!=0:
                x1,y1,w1,h1 = bounding_boxes[i-1]
                # if y+h < (L_H*(1/2)) and y < bounding_boxes[i-1][1] and h < bounding_boxes[i-1][3]:
                if y+h < (L_H*(1/2)) or y+h < y1+(h1/2):
                    exp = 1
                    cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,0),2)
            i = i+1
            char_type.append(exp)
    
    if(show == True):        
        plt.figure(figsize=(15,8))    
        plt.axis("on")
        plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        # plt.show()

    df_char = pd.DataFrame(char_locs)
    df_char.columns=['X1','Y1','X2','Y2','area']
    df_char['exp'] = char_type
    print(df_char)
    df_char['line_name'] = line_name
    df_char['box_num'] = box_num

    return df_char


def get_roi(image):
    df_lines = pd.DataFrame()
    r = 0
    H,W = image.shape[:2] 
    cleaned_orig,y1s,y2s = extract_line(image)
    x1s = [0]*len(y1s)
    x2s = [W]*len(y1s)
    df = pd.DataFrame([y1s,y2s,x1s,x2s]).transpose()
    df.columns = ['y1','y2','x1','x2']
    df['box_num'] = r
    df_lines= pd.concat([df_lines, df])
    dict_clean_img.update({r:cleaned_orig})
    dict_img.update({r:image})

    df_lines['line_name'] = ['%d%d' %(df_lines.box_num.iloc[i],df_lines.index[i]) for i in range(len(df_lines))]

    list_chars = list(df_lines.apply(lambda row: text_segment(row['y1'],row['y2'],\
                    row['x1'],row['x2'], row['box_num'],row['line_name'], \
                    show=True), axis=1))

    return list_chars

def process(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img, (45, 45), interpolation=cv2.INTER_CUBIC)
    norm_image = cv2.normalize(img, None, alpha = 0, beta = 1, norm_type = cv2.NORM_MINMAX, dtype = cv2.CV_32F)
    norm_image = norm_image.reshape((norm_image.shape[0], norm_image.shape[1], 1))
    case = np.asarray([norm_image])
    pred = model.predict([case])

    return pred

def symbol(ind):
    symbols = ['(', ')', '+', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '=', 'A', 'C', 'H', 'M', 'N', 'R', 'S', 'X', '[', ']', 'b', 'cos', 'd', 'div', 'e', 'f', 'geq', 'gt', 'i', 'infty', 'j', 'k', 'l', 'leq', 'log', 'lt', 'neq', 'o', 'p', 'pi', 'q', 'sin', 'sqrt', 'tan', 'theta', 'times', 'u', 'v', 'w', 'y', '{', '}']
    symb = symbols[ind.argmax()]
    return symb

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