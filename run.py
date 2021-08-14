import sys
from flask import Flask, flash, request, redirect,jsonify
import numpy as np
import pandas as pd
pd.set_option('display.max_rows', None)
import math
import os
import ast
import cv2
from flask.helpers import flash
import json
import statistics as stat
app = Flask(__name__)

run_local=True
local_reviewReady="True"
local_basepath='C:/Users/Franco/Desktop/GRAIPH/Demo/' 

def unique(x):
    return(pd.unique(x))

def sqrt(x):
    return(math.sqrt())

def head(x,*args):
    if len(args) == 0:
        return(x.head())
    else:
        return(x.head(args[0]))

def tail(x,*args):
    if len(args) == 0:
        return(x.tail())
    else:
        return(x.tail(args[0]))

def nrow(x):
    return(x.shape[0])

def ncol(x):
    return(x.shape[1])

def dim(x):
    return(x.shape)

def integer(x):
    return(x.astype(np.float))

def rbind(*args):
    return(pd.concat(args))

def cbind(*args):
    return(pd.concat(args,axis=1))

def sort(df,x):
    return(df.sort_values(by=[x]))

def subset(x,*args):
    if len(args) == 0:
        return(x)
    if len(args) == 1:
        return(x[args[0]])
    elif len(args) == 2:
        m=np.logical_and(args[0], args[1])
        return(x[m])
    else:
        siz=len(args)
        m=np.logical_and(args[0], args[1])
        for i in range(2,siz):
            m=np.logical_and(args[i],m)
        return(x[m])

def subset_or(x,*args):
    if len(args) == 1:
        return(x[args[0]])
    else:
        siz=len(args)
        m=subset(x,args[0])
        for i in range(1,siz):
            m=rbind(m,subset(x,args[i]))
        return(m)

def degrees(x):
    return(180*x/3.1415)

def radians(x):
    return(x*3.1415/180)

def table(x):
    return(x.value_counts())

def getAbs(df,dd,dr):
    abs=[]
    absi=[]
    absf=[]
    xreal=[]
    for i in range(nrow(df)):
        abs.append(round(absDistance(df.iloc[[i]],dd,dr),2))
        rat=subset(dd,dd['image']==df.iloc[i]['image']).iloc[0]['ratio']
        absi.append(round(abs[-1]-(rat*df.iloc[i]['xsize']/2),2))
        absf.append(round(abs[-1]+(rat*df.iloc[i]['xsize']/2),2))
        xreal.append(round(df.iloc[i]['xsize']*rat,2))
        print("Abs done for:",i+1,"/",nrow(df),end='\r')
    df['abs']=abs
    df['absi']=absi
    df['absf']=absf
    df['xreal']=xreal
    print("\n---Abs Complete---")
    return(df)

def getReal(df,dd):
    real=[]
    reali=[]
    realf=[]
    for i in range(nrow(df)):
        real.append(round(realDistance(df.iloc[[i]],df,dd),2))
        rat=subset(dd,dd['image']==df.iloc[i]['image']).iloc[0]['ratio']
        reali.append(round(real[-1]-(df.iloc[i]['xsize']*rat/2),2))
        realf.append(round(real[-1]+(df.iloc[i]['xsize']*rat/2),2))
        print("Real done for:",i+1,"/",nrow(df),end='\r')
    df['real']=real
    df['reali']=reali
    df['realf']=realf    
    print("\n---Real Complete---")
    return(df)

def absDistance(x,dd,dr):
    # global px,py
    # numm = x.iloc[0]['number']
    rat=subset(dd,dd['image']==x.iloc[0]['image']).iloc[0]['ratio']
    st=subset(dd,dd['image']==x.iloc[0]['image']).iloc[0]['start']
    pasti=subset(dr,dr['clas']=="ROC",dr['image']==x.iloc[0]['image'],dr['number']<x.iloc[0]['number'])
    curr=subset(dr,dr['clas']=="ROC",dr['image']==x.iloc[0]['image'],dr['number']==x.iloc[0]['number'])
    ptot=((pasti['y2']-pasti['y1'])**2)+((pasti['x2']-pasti['x1'])**2)
    past=sum(ptot.apply(math.sqrt))*rat
    if x.iloc[0]['lx']==[]:
        xc=(x.iloc[0]['xmin']+x.iloc[0]['xmax'])/2
        yc=(x.iloc[0]['ymin']+x.iloc[0]['ymax'])/2
    else:
        px=x.iloc[0]['lx']
        py=x.iloc[0]['ly']
        minp=np.argmin(py)
        maxp=np.argmax(py)
        # midp=3-minp-maxp
        xs=px[maxp]
        ys=py[maxp]
        xi=px[minp]
        yi=py[minp]
        xc=(xs+xi)/2
        yc=(ys+yi)/2
    act=math.sqrt((curr.iloc[0]['y1']-yc)**2 + (curr.iloc[0]['x1']-xc)**2)*rat
    return(st+past+act)

def realDistance(x,df,dd):
    if x.iloc[0]['clas'] in ["T","T2","SE","EE"]:
        return(x.iloc[0]['p1'])
    dff=subset(df,df['image']==x.iloc[0]['image'],df['abs']<x.iloc[0]['abs'])
    dft=subset_or(dff,dff['clas'].isin(["T","SE"]))
    if nrow(dft)==0:
        ddd=subset(dd,dd['image']==x.iloc[0]['image'])
        return(ddd.iloc[0]['start'])
    pre=tail(sort(dft,'abs'),1)
    whit=subset(dff,dff['clas'].isin(["C","T2","MF","MM","MG"]))
    whit=subset(whit,whit['abs']>pre.iloc[0]['absf'], whit['abs']<x.iloc[0]['abs'])
    can=sum(whit['xreal']*whit['rdc'])
    st=pre.iloc[0]['p1']
    return(st+(x.iloc[0]['abs']-pre.iloc[0]['absf'])-can)

def isOverlap(R1, R2):
    if (R1[0]>=R2[2]) or (R1[2]<=R2[0]) or (R1[3]<=R2[1]) or (R1[1]>=R2[3]):
        return False,0
    else:
        perc=((min([R1[2],R2[2]])-max([R1[0],R2[0]]))*(min([R1[3],R2[3]])-max([R1[1],R2[1]])))/((R1[2]-R1[0])*(R1[3]-R1[1]))
        return True,perc

def genSegments(df,dr,side):
    image=[]
    xminp=[]
    xmaxp=[]
    yminp=[]
    ymaxp=[]
    number=[]
    lx=[]
    ly=[]
    uni=unique(dr['image'])
    for k in range(0,len(uni)):
        df2=subset(dr,dr['image']==uni[k])
        dsid=subset(df2,df2['clas']=="CAN")
        ptot=((dsid.iloc[0]['y2']-dsid.iloc[0]['y1'])**2)+((dsid.iloc[0]['x2']-dsid.iloc[0]['x1'])**2)
        plen=math.sqrt(ptot)
        ratio=dsid.iloc[0]['scale']
        sidep=round(side*plen/(2*ratio))
        df2=subset(df2,df2['clas']=="ROC")
        for i in range(nrow(df2)):
            seg=df2.iloc[i]['x2']-df2.iloc[i]['x1']
            for j in range((math.floor(seg/(2*sidep)))):
                xmin=int(round((df2.iloc[i]['x1']+j*2*sidep)))
                xmax=int(round(xmin+(sidep*2)))
                ymin=int(round(df2.iloc[i]['m']*((xmin+xmax)/2)+((df2.iloc[i]['b']-sidep))))
                ymax=int(round(ymin+(sidep*2)))
                xminp.append(xmin)
                xmaxp.append(xmax)
                yminp.append(ymin)
                ymaxp.append(ymax)
                image.append(uni[k])
                number.append(i+1)
                lx.append([])
                ly.append([])
            j=(math.floor(seg/(2*sidep)))
            xmin=int(round((df2.iloc[i]['x1']+j*2*sidep)))
            xmax=int(round(df2.iloc[i]['x2']))
            ymin=int(round(df2.iloc[i]['m']*((xmin+xmax)/2)+((df2.iloc[i]['b']-sidep))))
            ymax=int(round(ymin+(sidep*2)))
            xminp.append(xmin)
            xmaxp.append(xmax)
            yminp.append(ymin)
            ymaxp.append(ymax)
            image.append(uni[k])
            number.append(i+1)
            lx.append([])
            ly.append([])
        print("Segment done for:",k+1,"/",len(uni),end='\r')
    print("Segments Complete")
    dcr=pd.DataFrame({'image':image,'xmin':xminp,'ymin':yminp,'xmax':xmaxp,'ymax':ymaxp,'clas':"CR",'p1':0,'p2':'','number':number,'lx':lx,'ly':ly})
    dcr['xsize']=dcr['xmax']-dcr['xmin']
    db=subset(df,df['clas'].isin(["T","T2","C"]))
    db=subset(db,db.xsize>30)
    uni=unique(df['image'])
    delist=[]
    for i in range(len(uni)):
        dff=subset(dcr,dcr['image']==uni[i])
        dfb=subset(db,db['image']==uni[i])
        for j in range(nrow(dff)):
            R1=dff.iloc[j][1:5].values
            for k in range(nrow(dfb)):
                R2=dfb.iloc[k][1:5].values
                over,v = isOverlap(R1, R2)
                if over==True:
                    delist.append(dff.iloc[j].name)
                    break
    dcr=dcr.drop(delist)
    df=rbind(df,dcr)
    df=df.reset_index(drop=True)
    return(df)

def saveSegments(df):
    dcr=subset(df,df['clas']=="CR")
    dcr=dcr.drop(['p2','abs','absi','absf','xsize','number','p1','clas','rdc'], axis=1)
    dcr=dcr.reset_index(drop=True)
    # dcr.to_csv("Segments."+corename+".csv",index=False)
    return dcr

def assignRows(df,dr):
    number=[]
    # m=[]
    # b=[]
    for i in range(nrow(df)):
        drf=subset(dr,dr['clas']=="ROC",dr['image']==df.iloc[i]['image'])
        if nrow(drf)==0:
            print("Missing DR tags")
        else:
            drf=sort(drf,'y1')
            cx=(df.iloc[i]['xmin']+df.iloc[i]['xmax'])/2
            cy=(df.iloc[i]['ymin']+df.iloc[i]['ymax'])/2
            dist=[]
            pend=[]
            cort=[]
            for j in range(nrow(drf)):
                ra=drf.iloc[j]['m']
                rb=-1
                rc=drf.iloc[j]['b']
                dact=abs(((ra*cx)+(rb*cy)+rc))/math.sqrt(((ra)**2)+((rb)**2))
                dist.append(dact)
                pend.append(ra)
                cort.append(rc)
            ind = np.argmin(np.array(dist))
            number.append(ind+1)
        print("Rows done for:",i+1,"/",nrow(df),end='\r')
    print("\n---Row Assignment Complete---")
    df['number']=number
    return(df)

def genRatios(dd,dr):
    rat=[]
    drr=subset(dr,dr['clas']=='CAN')
    drr=sort(drr,'image')
    drr=drr.reset_index(drop=True)
    ddd=sort(dd,'image')
    ddd=ddd.reset_index(drop=True)
    for i in range(nrow(dd)):
        scale=drr['scale'][i]
        ptot=((drr.iloc[i]['y2']-drr.iloc[i]['y1'])**2)+((drr.iloc[i]['x2']-drr.iloc[i]['x1'])**2)
        plen=math.sqrt(ptot)
        rat.append(scale/plen)
        print("Ratios done for:",i+1,"/",nrow(dd),end='\r')
    dd['ratio']=rat
    dd=sort(dd,'start')
    print("\n---Ratios Complete---")
    return(dd)

def adjustTags(df,dr,dd,min_dist):
    df2=df.copy()
    df2s=subset(df,df['clas']!='J',df['clas']!='V',df['clas']!='J3',df['clas']!='V3',df['clas']!='L',df['clas']!='A',df['clas']!='MNZ',df['clas']!='OBS')
    df2s=df2s.sort_values(by=['image','number','xmin'])
    drs=subset(dr,dr['clas']=='ROC')
    images=unique(df['image'])
    rows_to_drop=[]
    for image in images:
        df2s_img=subset(df2s,df2s['image']==image)
        drs_img=subset(drs,drs['image']==image)
        dds_img=subset(dd,dd['image']==image)
        dds_img=dds_img.reset_index(drop=True)
        min_pix=min_dist/dds_img['ratio'][0]
        numbers=unique(df2s_img['number'])
        for number in numbers:
            df2s_num=subset(df2s_img,df2s_img['number']==number)
            drs_num=subset(drs_img,drs_img['number']==number)
            drs_num=drs_num.reset_index(drop=True)
            indexes=df2s_num.index
            if len(indexes)>0:
                if df2.loc[indexes[0],'xmin']<drs_num['x1'][0]:
                    if df2.loc[indexes[0],'xmax']<=drs_num['x1'][0]:
                        rows_to_drop.append(indexes[0])
                    else:
                        df2.loc[indexes[0],'xmin']=drs_num['x1'][0]
                else:
                    if df2.loc[indexes[0],'xmin']-drs_num['x1'][0]<min_pix:
                        df2.loc[indexes[0],'xmin']=drs_num['x1'][0]
                    else:
                        pass
                if df2.loc[indexes[-1],'xmax']>drs_num['x2'][0]:
                    if df2.loc[indexes[-1],'xmin']>=drs_num['x2'][0]:
                        rows_to_drop.append(indexes[-1])
                    else:
                        df2.loc[indexes[-1],'xmax']=drs_num['x2'][0]
                else:
                    if drs_num['x2'][0]-df2.loc[indexes[-1],'xmax']<min_pix:
                        df2.loc[indexes[-1],'xmax']=drs_num['x2'][0]
                    else:
                        pass
                for i in range(len(indexes)-1):
                    if df2.loc[indexes[i+1],'xmin']-df2.loc[indexes[i],'xmax']<min_pix:
                        xmean=int((df2.loc[indexes[i],'xmax']+df2.loc[indexes[i+1],'xmin'])*0.5)
                        df2.loc[indexes[i],'xmax']=xmean
                        df2.loc[indexes[i+1],'xmin']=xmean                   
    df2=df2.drop(rows_to_drop)
    df2=df2.reset_index(drop=True)
    return df2

def vggToPandas(df):
    df2=subset(df,df['clase']!="CAN",df['clase']!="ROC")
    clas=df2.clase
    image=df2.imgName
    xmin=[]
    ymin=[]
    xmax=[]
    ymax=[]
    p1=[]
    p2=[]
    lx=[]
    ly=[]
    for i in range(nrow(df2)):
        clase=df2.iloc[i]['clase']
        if clase in ['J3','V3']:
            px=df2.iloc[i]['oriX'][1:-1].split(sep=',')
            py=df2.iloc[i]['oriY'][1:-1].split(sep=',')
            px=list(map(int, px))
            py=list(map(int, py))
            xmin.append(min(px))
            ymin.append(min(py))
            xmax.append(max(px))
            ymax.append(max(py))
            lx.append(px)
            ly.append(py)
            p1.append(0)
            p2.append("")
        else:
            xmin.append(int(df2.iloc[i]['oriX']))
            ymin.append(int(df2.iloc[i]['oriY']))
            xmax.append(int(df2.iloc[i]['oriX'])+int(df2.iloc[i]['width']))
            ymax.append(int(df2.iloc[i]['oriY'])+int(df2.iloc[i]['height']))
            lx.append([])
            ly.append([])
            attrib=ast.literal_eval(df2.iloc[i]['atribute'])
            if clase=='T':
                p1.append(float(attrib['prof'].replace(",",".")))
                p2.append("")
            elif clase=='L':
                p1.append(0)
                p2.append(attrib['lit'])
            elif clase=='A':
                p1.append(0)
                p2.append(attrib['alt'])
            elif clase=='MNZ':
                p1.append(0)
                p2.append(attrib['min'])
            elif clase=='OBS':
                p1.append(0)
                p2.append(attrib['obs'])
            else:
                p1.append(0)
                p2.append("")  
        print("Vgg conv. done for:",i+1,"/",nrow(df2),end='\r')
    print("\n---VGG conv. Complete---")
    df2=pd.DataFrame({'image':image,'xmin':xmin,'ymin':ymin,'xmax':xmax,'ymax':ymax,'clas':clas,'lx':lx,'ly':ly,'p1':p1,'p2':p2})
    return(df2)

def extractRoc(df):
    df2=subset(df,df['clase'].isin(["CAN","ROC"]))
    df2=df2.reset_index(drop=True)
    image=df2.imgName
    clas=df2.clase
    x1=[]
    y1=[]
    x2=[]
    y2=[]
    m=[]
    b=[]
    number=[]
    scale=[]
    for i in range(nrow(df2)):
        px=df2.iloc[i]['oriX'][1:-1].split(sep=',')
        py=df2.iloc[i]['oriY'][1:-1].split(sep=',')
        px=list(map(int, px))
        py=list(map(int, py))
        minp=np.argmin(px)
        maxp=np.argmax(px)
        x1.append(px[minp])
        y1.append(py[minp])
        x2.append(px[maxp])
        y2.append(py[maxp])
        a=(py[maxp]-py[minp])/(px[maxp]-px[minp])
        n=py[maxp]-a*px[maxp]
        m.append(a)
        b.append(n)
        if df2.clase[i]=='ROC':
            scale.append('')
        else:
            attrib=ast.literal_eval(df2.iloc[i]['atribute'])
            scale.append(float(attrib['dist'].replace(",",".")))
        print("ROC done for:",i+1,"/",nrow(df2),end='\r')
    dr2=pd.DataFrame({'image':image,'x1':x1,'y1':y1,'x2':x2,'y2':y2,'clas':clas,'m':m,'b':b,'scale':scale})
    dr3=subset(dr2,dr2['clas']=='ROC')
    daux=subset(dr2,dr2['clas']=='CAN')
    daux['number']=0
    dr3=dr3.sort_values(by = ['image', 'y2'], ascending = [True, True])
    ord=dr3['image'].value_counts(sort=False).sort_index()
    for j in range(len(ord)):
        number.extend(list(range(1,ord[j]+1)))
    dr3['number']=number
    dr2=rbind(dr3,daux)
    print("\n---ROC Complete---")
    return(dr2)

def generateDD(df):
    print("todo ok ")
    uni=unique(df['imgName'])
    print("todo ok 1")
    start=[int(x.split(sep="_",maxsplit=4)[1])/100 for x in uni]
    end=[int(x.split(sep="_",maxsplit=4)[2][0:6])/100 for x in uni]
    hei=[]
    wid=[]
    for i in range(len(uni)):
        df2=subset(df,df['imgName']==uni[i])
        hei.append(int(df2.iloc[0]['imgHeight']))
        wid.append(int(df2.iloc[0]['imgWidth']))
    dd=pd.DataFrame({'image':uni,'start':start,'end':end,'height':hei,'width':wid})
    print("\n---DD Built---")
    return(dd)

#def genTags(df,dd,corename):
#    dff=subset(df,df['clas']!="SE",df['clas']!="EE")
#    dftag=pd.DataFrame({'image':dff.image,'xmin':round(dff.xmin/dff.width,4),'ymin':round(dff.ymin/height,4),'xmax':round(dff.xmax/width,4),'ymax':round(dff.ymax/height,4),'clas':dff.clas})
#    return(dftag)

def getAngles(df,al,bl,corename,anglesClas):
    alpha=[]
    beta=[]
    df2=subset(df,df['clas'].isin(anglesClas[0]))
    df2=df2.reset_index(drop=True)
    for i in range(nrow(df2)):
        px=df2.iloc[i]['lx']
        px=[px[0],px[1],px[3]]
        py=df2.iloc[i]['ly']
        py=[py[0],py[1],py[3]]
        minp=np.argmax(py)
        maxp=np.argmin(py)
        midp=3-minp-maxp
        xs=px[maxp]
        ys=py[maxp]
        xc=px[midp]
        yc=py[midp]
        xi=px[minp]
        yi=py[minp]
        orx=(xs+xi)*0.5
        orz=(ys+yi)*0.5
        p_sup=np.array([xs-orx,0,orz-ys])
        p_inf=np.array([xi-orx,0,orz-yi])
        radio=(yi-ys)*0.5
        beta_i_desfase=np.arcsin((yc-orz)/radio)
        p_cen=np.array([xc-orx,-radio*np.cos(beta_i_desfase),yc-orz])
        beta_i_desfase=(180.0/np.pi)*beta_i_desfase
        v1=p_inf-p_sup
        v2=p_cen-p_sup
        cp=np.cross(v1,v2)
        a,b,c=cp
        if b==0 and c==0:
            beta_i=-99
        if b==0 and c>0:
            beta_i=90
        if b==0 and c<0:
            beta_i=270
        if c==0 and b>0:
            beta_i=180
        if c==0 and b<0:
            beta_i=0
        if b!=0 and c!=0:
            beta_i=int((180.0/np.pi)*np.arctan(np.abs(c/b)))
            if b<0 and c<0:
                pass
            if b>0 and c<0:
                beta_i=180-beta_i
            if b>0 and c>0:
                beta_i=180+beta_i
            if b<0 and c>0:
                beta_i=360-beta_i
        if not (b==0 and c==0):
            beta_i = beta_i + beta_i_desfase
            if beta_i < 0:
                beta_i = 360 - np.abs(beta_i)
            if beta_i > 360:
                beta_i = beta_i - 360
            cos_alpha_i=np.abs(a/((a**2.0+b**2.0+c**2.0)**0.5))
            alpha_i=np.arccos(cos_alpha_i)
            alpha_i=90-((180/np.pi)*alpha_i)
        else:
            alpha_i=90
            beta_i=-99
        alpha_i=alpha_i+al
        if alpha_i > 90:
            alpha_i = (alpha_i-90)
            beta_i = beta_i + 180
        beta_i=beta_i+bl
        if beta_i > 360:
            beta_i = (beta_i-360)
        alpha.append(round(alpha_i,2))
        beta.append(round(beta_i,2))
        print("3P Angles done for:",i+1,"/",nrow(df2),end='\r')
    df2['Alpha']=np.round(alpha)
    df2['Beta']=np.round(beta)
    alpha=[]
    beta=[]
    df3=subset(df,df['clas'].isin(anglesClas[1]))
    df3=df3.reset_index(drop=True)
    for i in range(nrow(df3)):
        if (df.iloc[i]['xmax']-df.iloc[i]['xmin'])!=0 and (df.iloc[i]['ymax']-df.iloc[i]['ymin'])!=0:
            alpha.append(90-(round(degrees(math.atan(((df.iloc[i]['xmax']-df.iloc[i]['xmin'])/(df.iloc[i]['ymax']-df.iloc[i]['ymin'])))),1)))
        else:
            alpha.append(-99)
        beta.append(-99)
        print("Box Angles done for:",i+1,"/",nrow(df3),end='\r')
    df3['Alpha']=np.round(alpha)
    df3['Beta']=np.round(beta)
    dff=rbind(df2,df3)
    dfff=pd.DataFrame({'core':[corename]*nrow(dff),'depth':dff['real'],'alpha':dff['Alpha'],'beta':dff['Beta']})
    dfff=dfff.reset_index(drop=True)
    print("Angles Complete")
    # dff.to_csv(basepath+"Angles."+corename+".csv",index=False)
    # print("Angles written to Angles.csv")
    return dfff

# def printBoxes(df):
#     cdict={"J":(0,255,0),"T":(255,0,0),"T2":(255,255,255),"TM":(255,255,255),"C":(255,255,255),"MF":(208,114,244),"MM":(255,0,106),"MG":(0,0,255)}
#     df.xmin=df.xmin.astype(int)
#     df.xmax=df.xmax.astype(int)
#     df.ymin=df.ymin.astype(int)
#     df.ymax=df.ymax.astype(int)
#     uni=unique(df['image'])
#     for i in range(len(uni)):
#         if os.path.isfile("images/"+uni[i]):
#             img = cv2.imread("images/"+uni[i])
#             df2=subset(df,df['image']==uni[i],df['clas']!="SE",df['clas']!="EE")
#             for j in range(nrow(df2)):
#                 if df2.iloc[j]['clas'] in cdict:
#                     colclass=cdict[df2.iloc[j]['clas']]
#                 else:
#                     colclass=(255,255,255)
#                 cv2.rectangle(img, (df2.iloc[j]['xmin'].astype(int), df2.iloc[j]['ymin'].astype(int)), (df2.iloc[j]['xmax'].astype(int), df2.iloc[j]['ymax'].astype(int)), colclass, 4)
#                 cv2.putText(img,"C:"+str(df2.iloc[j]['clas']),(df2.iloc[j]['xmin'].astype(int),(df2.iloc[j]['ymin']).astype(int)-8),cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255),2)
#             cv2.imwrite("images_tags/"+uni[i],img)
#         print("Tag Images done for:",i+1,"/",len(uni),end='\r')
#     print("Tag Images Complete")

def buildVirtual(df,dd,dr):
    vydim=np.mean(df['ymax']-df['ymin'])
    uni=unique(df['image'])
    image=[]
    clas=[]
    number=[]
    xmin=[]
    ymin=[]
    xmax=[]
    ymax=[]
    lx=[]
    ly=[]
    p1=[]
    p2=[]
    for i in range(len(uni)):
        inl=subset(dr,dr['image']==uni[i])  
        inli=subset(inl,inl['number']==1)
        inlf=subset(inl,inl['number']==max(inl['number']))
        image.append(uni[i])
        image.append(uni[i])
        xmin.append(min(inli['x1'])-0.01)
        xmin.append(max(inlf['x2'])-0.01)
        xmax.append(min(inli['x1'])+0.01)
        xmax.append(max(inlf['x2'])+0.01)
        ymin.append(min(inli['y1'])-vydim/2)
        ymin.append(max(inlf['y2'])-vydim/2)
        ymax.append(min(inli['y1'])+vydim/2)
        ymax.append(max(inlf['y2'])+vydim/2)
        clas.append("SE")
        clas.append("EE")
        lx.append([])
        lx.append([])
        ly.append([])
        ly.append([])
        number.append(1)
        number.append(max(inlf['number']))
        mat=subset(dd,dd['image']==uni[i])
        p1.append(mat.iloc[0]['start'])
        p1.append(mat.iloc[0]['end'])
        p2.append(0)
        p2.append(0)

    df2=pd.DataFrame({'image':image,'xmin':xmin,'ymin':ymin,'xmax':xmax,'ymax':ymax,'clas':clas,'lx':lx,'ly':ly,'p1':p1,'p2':p2,'number':number})
    df2['xsize']=df2['xmax']-df2['xmin']
    df=rbind(df,df2)
    return(df)

def getMolido(df,corename,mls):
    dfm=subset(df,df['clas'].isin(mls))
    dfa2=pd.DataFrame({'core':[corename]*nrow(dfm),'from':dfm['reali'],'to':dfm['realf'], 'clas':dfm['clas']})
    dfa2=sort(dfa2,'from')
    dfa2=dfa2.reset_index(drop=True)
    return dfa2
    # dfa2.to_csv(basepath+"Molido."+corename+".csv",index=False)

# def genSegments(df,corename):
#     dcr=subset(df,df['clas']=="CR")
#     dcr=dcr.drop(['p2','abs','absi','absf','xsize','number','p1','clas','rdc'], axis=1)
    #dcr.to_csv(basepath+"Segments."+corename+".csv",index=False)

# def getLitho(df):
#     dfl=subset(df,df['clas']=='L')
#     dfe=subset(df,df['clas']=='EE')
#     dfl=sort(dfl,'real')
#     start=dfl['reali']
#     end=list(dfl['reali'])
#     end[1:].append(max(dfe['real']))
#     df2=pd.DataFrame({'From':start,'To':end,'Litho':dfl['p1']})
#     return(df2)

# def getAlt(df):
#     dfl=subset(df,df['clas']=='A')
#     dfe=subset(df,df['clas']=='EE')
#     dfl=sort(dfl,'real')
#     start=dfl['reali']
#     end=list(dfl['reali'])
#     end[1:].append(max(dfe['real']))
#     df2=pd.DataFrame({'From':start,'To':end,'Minerals':dfl['p1'],'Intensity':dfl['p2']})
#     return(df2)

# def getMin(df):
#     dfl=subset(df,df['clas']=='MNZ',df['p1']!=999)
#     dfe=subset(df,df['clas']=='EE')
#     dfl=sort(dfl,'real')
#     start=dfl['reali']
#     end=list(dfl['reali'])
#     end[1:].append(max(dfe['real']))
#     df2=pd.DataFrame({'From':start,'To':end,'Mineralization':dfl['p1'],'Type':dfl['p2']})
#     return(df2)

def getGeo(df,geoClasses,corename):
    maxDepth=np.max(df['realf'])
    dfs=subset_or(df,df['clas']==geoClasses[0],df['clas']==geoClasses[1])
    dfs=sort(dfs,'real')
    dfs=dfs.reset_index(drop=True)
    dfsLen=nrow(dfs)
    dfsFrom=[]
    dfsTo=[]
    dfsC=[]
    verif=False
    for i in range(dfsLen):
        dfsClasI=dfs['clas'][i]
        if verif==True:
            dfsTo.append(dfs['real'][i])
        if i == dfsLen-1:
            if dfsClasI == geoClasses[0]:
                dfsFrom.append(dfs['real'][i])
                dfsC.append(dfs['p2'][i])
                dfsTo.append(maxDepth)
        elif i == 0:
            if dfsClasI == geoClasses[0]:
                dfsFrom.append(dfs['real'][i])
                dfsC.append(dfs['p2'][i])
                verif=True
        else:
            if dfsClasI == geoClasses[0]:
                dfsFrom.append(dfs['real'][i])
                dfsC.append(dfs['p2'][i])
                verif=True
            else:
                verif=False
    df2=pd.DataFrame({'core':[corename]*len(dfsFrom),'from':dfsFrom,'to':dfsTo,geoClasses[2]:dfsC})
    return(df2)

def review(df,dr,dd):
    clas=[]
    note=[]
    verificador="True"
    drr=subset(dr,dr['clas']=='ROC')
    drc=subset(dr,dr['clas']=='CAN')
    drNum=[]
    for i in range(nrow(dd)):
        dr_sub=subset(drr,drr['image']==dd['image'][i])
        dr_sub=dr_sub.reset_index(drop=True)
        drNum.append(nrow(dr_sub))
    drMode=stat.mode(drNum)
    for i in range(nrow(dd)):
        img=dd['image'][i]
        start_img=dd['start'][i]
        end_img=dd['end'][i]
        dr_sub=subset(drr,drr['image']==img)
        dr_sub=dr_sub.reset_index(drop=True)
        dc_sub=subset(drc,drc['image']==img)
        dc_sub=dc_sub.reset_index(drop=True)
        df_sub=subset(df,df['image']==img)
        df_sub=df_sub.reset_index(drop=True)
        tacos=subset_or(df_sub,df_sub['clas']=='T',df_sub['clas']=='TM')
        tacos=tacos.reset_index(drop=True)
        if nrow(dc_sub)==0:
            verificador="False"
            clas.append('False')
            msg=img+": No se encontraron etiquetas de \"Escala\". Etiquete una."
            note.append(msg)
            print(msg)
        if nrow(dc_sub)>1:
            verificador="False"
            clas.append('False')
            msg=img+": Se encontraron "+str(nrow(dc_sub))+" etiquetas de \"Escala\". Mantenga solamente una y elimine el resto."
            note.append(msg)
            print(msg)
        if nrow(dr_sub)==0:
            verificador="False"
            clas.append('False')
            msg=img+": No se encontraron etiquetas de \"Eje Sondaje\". Etiquete al menos una."
            note.append(msg)
            print(msg)
        if nrow(dr_sub)>0 and nrow(dr_sub)!=drMode:
            clas.append('True')
            msg=img+": Se encontraron "+str(nrow(dr_sub))+" etiquetas de \"Eje Sondaje\". Sus imágenes tienen "+str(drMode)+" en su mayoría. Revise por si acaso."
            note.append(msg)
            print(msg)
        if nrow(tacos)==0:
            clas.append('True')
            msg=img+": No se encontraron etiquetas de \"Taco\". Revise por si acaso."
            note.append(msg)
            print(msg)
        else:
            for j in range(nrow(tacos)):
                if ((tacos['p1'][j]<start_img) or (tacos['p1'][j]>end_img)):
                    verificador="False"
                    clas.append('False')
                    msg=img+": \"Taco\" con profundidad "+str(tacos['p1'][j])+" [m] no calza entre los "+str(start_img)+" y "+str(end_img)+" [m] de la imagen. Verifique la profundidad de cada \"Taco\"" 
                    note.append(msg)
                    print(msg)
                for k in range(nrow(tacos)):
                    
                    if ((tacos['number'][j]<tacos['number'][k]) and 
                        (tacos['p1'][j]>tacos['p1'][k])):
                        verificador="False"
                        clas.append('False')
                        msg=img+": \"Taco\" con profundidad "+str(tacos['p1'][j])+" [m] ubicado antes que otro con profundidad "+str(tacos['p1'][k])+" [m]. Verifique sus etiquetas."
                        note.append(msg)
                        print(msg)
                    if ((tacos['number'][j]==tacos['number'][k]) and 
                        (tacos['xmin'][j]<=tacos['xmin'][k]) and 
                        (tacos['p1'][j]>tacos['p1'][k])):
                        verificador="False"
                        clas.append('False')
                        msg=img+": \"Taco\" con profundidad "+str(tacos['p1'][j])+" [m] ubicado antes que otro con profundidad "+str(tacos['p1'][k])+" [m]. Verifique sus etiquetas."
                        note.append(msg)
                        print(msg)
    df2=pd.DataFrame({'clas':clas,'note':note})
    return (df2,verificador)

# Process Function ------------------------------------------------------------

app.secret_key = 'secret'
@app.route("/process",methods=['GET','POST'])
def process():
    
# Host ------------------------------------------------------------------------

    if run_local == False:
        
        if 'file' not in request.files:
            print("No file found")
            flash('No file part')
            print (request)
            response=jsonify({"error":"no file sent"})
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            return response 
        
        # ----- Request -----
        
        file=request.files['file'] #Archivo
        corename=request.form.get('corename') #Nombre del Sondaje
        get_output=request.form.get("get_output") #Get Geotecnia
        get_angles=request.form.get("get_angles") #Get Fracturas
        get_molido=request.form.get("get_molido") #Get Molidos
        get_litho=request.form.get("get_litho") #Get Litologia
        get_alt=request.form.get("get_alt") #Get Alteracion
        get_mnz=request.form.get("get_mnz") #Get Mineralizacion     
        get_veins=request.form.get("get_veins") #Get Vetillas
        get_obs=request.form.get("get_obs") #Get Observacion
        reviewReady=request.form.get("reviewReady") #Si hay o no revision
        
        # ----- Possible request -----
        
        gen_segments="False" #=request.form.get("gen_segments") Generar crops
        fixed_intervals="False" #=request.form.get("fixed_intervals") #Usar TM
        mlsr_m=0.5 #Factor de esparcimiento Molido
        mlsr_mf=0.5 #Factor de esparcimiento Molido Fino
        mlsr_mm=0.5 #Factor de esparcimiento Molido Medio
        mlsr_mg=0.5 #Factor de esparcimiento Molido Grueso
        mlsj_m=0  #Frecuencia de fracturas por metro Molido
        mlsj_mf=0 #Frecuencia de fracturas por metro Molido Fino
        mlsj_mm=0 #Frecuencia de fracturas por metro Molido Medio
        mlsj_mg=0 #Frecuencia de fracturas por metro Molido Grueso
        
        # ----- No request -----
        
        # print_boxes="False" #Obtener imagenes con etiquetas
        # gen_tags="False" #Archivo de tags entre 0-1.

        filename=file.filename
        print ("Filename: "+filename)

# Local -----------------------------------------------------------------------
        
    else:
        basepath=local_basepath
        file=basepath+'generated.csv'
        corename=''
        reviewReady=local_reviewReady
        get_output=True
        get_angles=True
        get_molido=True
        get_litho=True
        get_alt=True
        get_mnz=True
        get_veins=True
        get_obs=True
        gen_segments=True
        mlsr_m=0.5
        mlsr_mf=0.5
        mlsr_mm=0.5
        mlsr_mg=0.5
        mlsj_m=0
        mlsj_mf=0
        mlsj_mm=0
        mlsj_mg=0
        fixed_intervals=False
        # gen_tags=False
        # print_boxes=False
        
# Process ---------------------------------------------------------------------
    
    global df,dr,dd,dfk
    global dfMolido,dfAngles,dfVeins,dfLitho,dfAlt,dfMin,dfObs,dfCrops
    global dfReview,verificador
    # os.chdir(basepath)
    
    mls=["M","MF","MM","MG"]
    mlsr=[mlsr_m,mlsr_mf,mlsr_mm,mlsr_mg]
    mlsj=[mlsj_m,mlsj_mf,mlsj_mm,mlsj_mg]

# ----- Review -----

    if reviewReady=="False":
        
        try:
            df=pd.read_csv(file,sep=',')
            dr=df
            df=vggToPandas(df)
            dd=generateDD(dr)
            dr=extractRoc(dr)
            dd=genRatios(dd,dr)
            df=assignRows(df,dr)
            df=adjustTags(df,dr,dd,0.01)
            dfReview,verificador=review(df,dr,dd)
        except:
            dfReview=pd.DataFrame({'clas':['False'],'note':['Archivo inválido. Vuelva a subir un archivo con el formato correcto.']})
            verificador="False"
            
        if run_local==False:
            reviewFrame={}
            dfReview=dfReview.to_json(orient="columns")
            reviewFrame=json.loads(dfReview)
            response=jsonify({
                "ReviewData":reviewFrame,
                "VerificadorReview":verificador
            })   
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            print("Review Finished --------") 
            return response    
        else:
            print("Review Finished --------") 
            return 0
        
        
    df=pd.read_csv(file,sep=',')
    dr=df
    df=vggToPandas(df)
    dd=generateDD(dr)
    dr=extractRoc(dr)
    dd=genRatios(dd,dr)
    df=assignRows(df,dr)
    df=adjustTags(df,dr,dd,0.01)

# ----- Generate Tags -----
    #if gen_tags==True:
        #dftags=genTags(corename,df,dd)

# ----- Print Boxes -----
    # if print_boxes==True:
    #     printBoxes(df)

# ----- "Goto" -----
    #print(type(get_output))
    #if get_output==False:
    #    return(0)

    print("----- All Preproc Complete -----")

    df['xsize']=df['xmax']-df['xmin']

# ----- Switch to Fixed -----
    if fixed_intervals==True:
        cl=df.clas
        cl[cl=="T"]="T2"
        cl[cl=="TM"]="T"
        df['clas']=cl
    else:
        cl=df.clas
        cl[cl=="TM"]="T2"
        df['clas']=cl

# ----- Virtual Breaks Builder -----
    df=buildVirtual(df,dd,dr)

# ----- Segments Builder I -----
    if gen_segments==True or gen_segments=="True":
        df=genSegments(df,dr,0.05)

# ----- Distance Builder -----
    df2=df
    df=getAbs(df,dd,dr)

    print("----- Distance Complete -----")

# ----- Segments Builder II -----
    if gen_segments==True or gen_segments=="True":
        dcr=subset(df,df['clas']=="CR")
        dcr['rdc']=np.zeros(nrow(dcr))+1
        df=subset(df,df['clas']!="CR")

# ----- CSV Builder -----
    df=sort(df,'abs') 
    df.index=range(nrow(df))
    rdc=np.zeros(nrow(df))+1
    Start=[]
    End=[]
    FF=[]
    Frac=[]
    LenS=[]
    RQD=[]
    Sol=[]
    Frac=[]
    Mlist=[]
    uni=unique(df['image'])

    # Cache

    # ------

    for i in range(len(uni)):
        
        dff=subset(df,df['image']==uni[i])
        dff=sort(dff,'abs')
        dft=subset_or(dff,dff['clas']=="T", dff['clas']=="SE", dff['clas']=="EE")
        dft=sort(dft,'abs')
        dfj=subset_or(dff,dff['clas']=="J",dff['clas']=="J3")
        dfc=subset_or(dff,dff['clas']=="C",dff['clas']=="T2")
        dfm=subset_or(dff,dff['clas'].isin(mls))
        dfb=subset_or(dff,dff['clas']!="T")
        init=head(dft['p1'],len(dft['p1'])-1)
        fint=tail(dft['p1'],len(dft['p1'])-1)
        inia=head(dft['absf'],len(dft['absf'])-1)
        fina=tail(dft['absi'],len(dft['absi'])-1)
        init.index=range(len(init))
        fint.index=range(len(fint))
        inia.index=range(len(inia))
        fina.index=range(len(fina))

        for j in range(len(inia)):
            totSize=integer(fint[j])-integer(init[j])
            totSiza=fina[j]-inia[j]
            dfjTmp=subset(dfj,dfj['abs']>inia[j], dfj['abs']<fina[j])
            dfcTmp=subset(dfc,dfc['abs']>inia[j], dfc['abs']<fina[j])
            dfbTmp=subset(dfb,dfb['abs']>inia[j], dfb['abs']<fina[j])
            dfmTmp=subset(dfm,dfm['abs']>inia[j], dfm['abs']<fina[j])
            ccheck=0
            for m in range(len(mls)):
                Mlist.append([])
                Mlist[m].append(round(sum(subset(dfmTmp,dfmTmp['clas']==mls[m])['xreal']),3))
                ccheck=ccheck+Mlist[m][-1]
            dfbTmp=sort(dfbTmp,'abs')
            inim=[inia[j]]
            if nrow(dfbTmp)>0:
                finm=[]
                for k in range(nrow(dfbTmp)):
                    if dfbTmp.iloc[k]['clas']=="J" or dfbTmp.iloc[k]['clas']=="J3":
                        inim.append(dfbTmp.iloc[k]['abs'])
                        finm.append(dfbTmp.iloc[k]['abs'])
                    else:
                        inim.append(dfbTmp.iloc[k]['absf'])
                        finm.append(dfbTmp.iloc[k]['absi'])
                finm.append(fina[j])
            else:
                finm=fina[j]
            solid=pd.Series(finm)-pd.Series(inim)
            solid[solid<0]=0
            solid2=solid[solid>0]

            if (ccheck==0) and sum(solid)>(totSize):
                vLens=totSize
                coef=(totSize)/sum(solid)
            else:
                vLens=sum(solid)
                coef=1
            if ccheck==0:
                vLens=min(sum(solid),totSize)
                delta=0
                coef=(totSize)/sum(solid)
            else:
                vLens=sum(solid)
                coef=1
                delta=1-(totSize-vLens)/ccheck
            for i in range(nrow(dfmTmp)):
                rdc[dfmTmp.index.values[i]]=round(delta,3)

            solid2=solid2*coef
            s=list([round(x*coef,2) for x in solid2])
            t=(",".join(map(str,s)))

            Start.append(init[j])
            End.append(fint[j])
            LenS.append(vLens)
            FF.append(nrow(dfjTmp)/totSize)
            Frac.append(nrow(dfjTmp))
            RQD.append(sum(solid2[solid2>=0.1])/totSize)
            Sol.append(t)

    df['rdc']=rdc

    Start=round(pd.Series(Start),3)
    End=round(pd.Series(End),3)
    LenS=round(pd.Series(LenS),3)
    FF=round(pd.Series(FF),1)
    Size=round(pd.Series(End-Start),2)
    RQD=round(pd.Series(RQD),2)
    Esp=round(1/(FF+1),2)
    Core=[corename]*len(Start)
    Srec=LenS
    for n in range(len(mls)):
        Srec=Srec+pd.Series(Mlist[n])*mlsr[n]
    Rec=round((Srec)/Size,2)

    dfk=pd.DataFrame({'Core':Core,'Start':Start,'End':End,'Size':Size,'Rec':Rec,'FF':FF,'Frac':Frac,'Esp':Esp,'RQD':RQD,'LenS':LenS})
    
    for n in range(len(mls)):
        dfk[mls[n]]=pd.Series(Mlist[n])*mlsr[n]
        dfk['FF']=dfk['FF']+(dfk[mls[n]]*mlsj[n])
    dfk['Segs']=Sol
    dfk['Esp']=round(1/(dfk['FF']+1),2)
    dfk=subset(dfk,dfk['Size']>0.03)
    dfback=dfk

# ----- Picture Merger -----
    dft=subset(df,df['clas']=="T")
    dft=sort(dft,'p1')
    dft.index=range(nrow(dft))
    init=head(dft['p1'],len(dft['p1'])-1)
    fint=tail(dft['p1'],len(dft['p1'])-1)
    init.index=range(len(init))
    fint.index=range(len(fint))

    # print(init)
    # print(fint)

    Core=[]
    Start=[]
    End=[]
    Size=[]
    Rec=[]
    FF=[]
    Esp=[]
    RQD=[]
    LenS=[]
    Mlist=[]
    Frac=[]
    Segs=[]
    global Sg
    for i in range(len(init)):
        df3=subset(dfk,dfk['Start']>=init[i], dfk['End']<=fint[i])
        if nrow(df3)>0:
            Core.append(df3.iloc[0]['Core'])
            Start.append(init[i])
            End.append(fint[i])
            Size.append(fint[i]-init[i])
            Rec.append(sum(df3['Rec']*df3['Size'])/sum(df3['Size']))
            FF.append(sum(df3['FF']*df3['Size'])/sum(df3['Size']))
            RQD.append(sum(df3['RQD']*df3['Size'])/sum(df3['Size']))
            LenS.append(sum(df3['LenS']))

            for m in range(len(mls)):
                Mlist.append([])
                Mlist[m].append(round(sum(df3[mls[m]]),2))

            Frac.append(sum(df3['Frac']))
            if FF[-1]!=0:
                Esp.append(1/FF[-1])
            else:
                Esp.append(min(Size[-1],LenS[-1]))
            Segs.append(df3['Segs'][df3['Segs']!=""].str.cat(sep =","))

    Size=round(pd.Series(Size),2)
    FF=round(pd.Series(FF),1)
    Rec=round(pd.Series(Rec),2)    
    RQD=round(pd.Series(RQD),2)
    LenS=round(pd.Series(LenS),2)
    Esp=round(pd.Series(Esp),2)
    dfk=pd.DataFrame({'Core':Core,'Start':Start,'End':End,'Size':Size,"Rec":Rec,'FF':FF,'Frac':Frac,'Esp':Esp,'RQD':RQD,'LenS':LenS})
    for n in range(len(mls)):
        dfk[mls[n]]=pd.Series(Mlist[n])
    dfk['Segs']=Segs

    dfk.RQD[dfk.RQD>1]=1
    dfk['Rec'][dfk['Rec']>1]=1
    dfk=sort(dfk,'Start')
    # print(dfk)
    
    dfk['RQD']=round(dfk['RQD']*100,0)

# Host ------------------------------------------------------------------------    

    if run_local == False:

        parseFrame={}
        anglesFrame={}
        molidoFrame={}
        lithoFrame={}
        altFrame={}
        minFrame={}
        veinFrame={}
        obsFrame={}
        zcropsFrame={}
        
        # if get_output == "True" or get_molido == "True"  or get_angles == "True" or get_veins == "True" or gen_segments == "True" or get_litho == "True" or get_alt == "True" or get_mnz == "True" or get_obs == "True":
        if get_output == "True":
            dfJson=dfk.to_json(orient="columns")
            parseFrame=json.loads(dfJson)
        if gen_segments=="True":
            df=rbind(df,dcr)
            df=df.reset_index(drop=True)
        df=getReal(df,dd)
        if gen_segments=="True":
            dfCrops=saveSegments(df)
            dfCrops=dfCrops.to_json(orient="columns")
            zcropsFrame=json.loads(dfCrops)
        if get_molido == "True":
            dfMolido=getMolido(df,corename,mls)
            dfMolido=dfMolido.to_json(orient="columns")
            molidoFrame=json.loads(dfMolido)
            print("paso a get_molido")
        if get_angles == "True":
            dfAngles=getAngles(df,0,0,corename,[['J3'],['J']])
            dfAngles=dfAngles.to_json(orient="columns")
            anglesFrame=json.loads(dfAngles)
            print("paso a get_angles")
        if get_litho == "True":
            dfLitho=getGeo(df,['L','LF','lithology'],corename)
            dfLitho=dfLitho.to_json(orient="columns")
            lithoFrame=json.loads(dfLitho)
            print("paso a get_litho")
        if get_alt == "True":
            dfAlt=getGeo(df,['A','AF','alteration'],corename)
            dfAlt=dfAlt.to_json(orient="columns")
            altFrame=json.loads(dfAlt)
            print("paso a getAlt")
        if get_mnz == "True":
            dfMin=getGeo(df,['MNZ','MNZF','mineralization'],corename)
            dfMin=dfMin.to_json(orient="columns")
            minFrame=json.loads(dfMin)
        if get_veins == "True":
            dfVeins=getAngles(df,0,0,corename,[['V3'],['V']])
            dfVeins=dfVeins.to_json(orient="columns")
            veinFrame=json.loads(dfVeins)
            print("paso a get_veins")
        if get_obs == "True":
            dfObs=getGeo(df,['OBS','OBSF','observation'],corename)
            dfObs=dfObs.to_json(orient="columns")
            obsFrame=json.loads(dfObs)
            print("paso a getMin")
            
        response=jsonify({
            "MainData":parseFrame,
            "Angles":anglesFrame,
            "Molido":molidoFrame,
            "Litho":lithoFrame,
            "Alter":altFrame,
            "Miner":minFrame,
            "Veins":veinFrame,
            "Obs":obsFrame,
            "ZCrops":zcropsFrame
        })
        
        print("Finished --------")
        # response=jsonify({
        #         "filename":filename,
        #         "corename":corename,
        #         "ratio":ratio,
        #         "get_output":get_output,
        #         "get_angles":get_angles,
        #         "get_molido":get_molido,
        #         "print_boxes":print_boxes,
        #         "gen_tags":gen_tags,
        #         "fixed_intervals":fixed_intervals,
        #         "gen_segments":gen_segments,
        #         "get_litho":get_litho,
        #         "get_alt":get_alt,
        #         "get_mnz":get_mnz,})
    
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

# Local -----------------------------------------------------------------------
    
    else:
        # if fixed_intervals==True:
        #     dfk.to_csv(basepath+"Results.Fixed.Intervals."+corename+".csv",index=False)
        # else:
        #     dfk.to_csv(basepath+"Results."+corename+".csv",index=False)
        # print("File written to Results.csv")
        if get_output == True:
            pass
            #dfk.to_csv(basepath+'Geotecnia.csv',index=False)
        #if get_angles == True or get_molido == True or gen_segments == True or get_litho == True or get_alt == True or get_mnz == True:
        if gen_segments==True:
            df=rbind(df,dcr)
            df=df.reset_index(drop=True)
        df=getReal(df,dd)
        dfk.to_csv('C:/Users/Franco/Desktop/GRAIPH/Plantilla/Results.Demo.csv',index=False)
        df.to_csv('C:/Users/Franco/Desktop/GRAIPH/Plantilla/Elements.Demo.csv',index=False)
        if gen_segments==True:
            dfCrops=saveSegments(df)
            #dfCrops.to_csv(basepath+'Crops.csv',index=False)
            print("paso a get_segments")
        if get_molido == True:
            dfMolido=getMolido(df,corename,mls)
            #dfMolido.to_csv(basepath+'Molidos.csv',index=False)
            print("paso a get_molido")
        if get_angles == True:
            dfAngles=getAngles(df,0,0,corename,[['J3'],['J']])
            #dfAngles.to_csv(basepath+'Fracturas.csv',index=False)
            print("paso a get_angles")
        if get_litho == True:
            dfLitho=getGeo(df,['L','LF','lithology'],corename)
            #dfLitho.to_csv(basepath+'Litologia.csv',index=False)
            print("paso a get_litho")
        if get_alt == True:
            dfAlt=getGeo(df,['A','AF','alteration'],corename)
            #dfAlt.to_csv(basepath+'Alteracion.csv',index=False)
            print("paso a getAlt")
        if get_mnz == True:
            dfMin=getGeo(df,['MNZ','MNZF','mineralization'],corename)
            #dfMin.to_csv(basepath+'Mineralizacion.csv',index=False)
            print("paso a getMin")
        if get_veins == True:
            dfVeins=getAngles(df,0,0,corename,[['V3'],['V']])
            #dfVeins.to_csv(basepath+'Vetillas.csv',index=False)
            print("paso a get_veins")
        if get_obs == True:
            dfObs=getGeo(df,['OBS','OBSF','observation'],corename)
            #dfObs.to_csv(basepath+'Observacion.csv',index=False)
            print("paso a getMin")
            
if run_local:
    process()