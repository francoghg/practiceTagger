import { Injectable } from '@angular/core';
import { DataProcess, DataObject, GeneralData, MolidoData, AlterData, LitoData, MinerData, FracturaData, VetillaData, ObsData, ReviewData } from './import-analisis';
import { Papa } from 'ngx-papaparse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportAnalisisService {
  private procesUrl=environment.scriptUrl;
  constructor(private papa:Papa) { }
  private corename="";
  private ratio="1";
  private file:any;
  public generalResult=[];
  public molido=[];
  public angulos=[];
  public lito=[];
  public alt=[];
  public mnz=[];
  public vet=[];
  public obs=[];
  public generalDatas:GeneralData[]=[];
  public molidoData:MolidoData[]=[];
  public alterData:AlterData[]=[];
  public litoData:LitoData[]=[];
  public mnzData:MinerData[]=[];
  public fractData:FracturaData[]=[];
  public vetData:VetillaData[]=[];
  public obsData:ObsData[]=[];
  public anaList:DataProcess[]=[
    {
      nombre:"Geotecnia",
      estado:"get_output"
    },
    {
      nombre:"Molidos",
      estado:"get_molido"
    },
    {
      nombre:"Fracturas",
      estado:"get_angles"
    },
    {
      nombre:"Vetillas",
      estado:"get_veins"
    },
    {
      nombre:"Litología",
      estado:"get_litho"
    },
    {
      nombre:"Alteración",
      estado:"get_alt"
    },
    {
      nombre:"Mineralización",
      estado:"get_mnz"
    },
    {
      nombre:"Observación",
      estado:"get_obs"
    },
  ]
  public reviewReady="False"; 
  public review=[];
  public reviewData:ReviewData[]=[];

  setCorename(corename:string){
    this.corename = corename;
  }

  setRatio(ratio:string){
    this.ratio = ratio;
  }

  setFile(file){
    this.file=file;
  }

  setReviewReady(value){
    this.reviewReady=value
  }

  getReviewReady(){
    return this.reviewReady
  }

  getReview(){
    return this.reviewData
  }

  resetReview(){
    this.reviewData=[]
  }

  async postReview(){
    const formData=new FormData();
    formData.append("file",this.file);
    formData.append("reviewReady",this.reviewReady);
    const requestOptions = {
      method: "POST",
      body: formData,
      file: this.file,
    };
    fetch(this.procesUrl,requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const arrayData=Object.values(data);
      this.reviewReady=arrayData[1].toString();
      this.review=this.toArrayIndexer(arrayData[0]);
      this.toReviewData(this.review);
    })
  }

  private toReviewData(datos:any[][]){
    if (!this.isEmpty(datos)) {
      for (let index = 0; index < datos[0].length; index++) {
        const review:ReviewData={
          clas:datos[0][index],
          note:datos[1][index],
        }
        this.reviewData.push(review)      
      }
    }
  }

  async post(){     
    this.checkChecked()
    .then((result) => {
      if(result[0]){
        const formData=new FormData();
        formData.append("file",this.file);
        formData.append("corename",this.corename);        
        formData.append("ratio",this.ratio);
        for (let index = 0; index < result[1].length; index++) {
          formData.append(result[1][index].nombre,result[1][index].estado);
        }

        const requestOptions = {
          method: "POST",
          body: formData,
          file: this.file,
        };
        fetch(this.procesUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            // Almacenar datos para que puedan ser mostrados por
            // preview analisis
          if(typeof(data)==="object"){
            console.log(data);
            const arrayData=Object.values(data);
              for (let index = 0; index < arrayData.length; index++) {
                if (index===3) {
                  // extraer datos MainData
                  this.generalResult=this.toArrayIndexer(arrayData[index]);
                  this.toGeneralData(this.generalResult);
                }
                else if (index===5) {
                  // extraer datos molido                
                  this.molido=this.toArrayIndexer(arrayData[index]);
                  this.toMolidoData(this.molido);
                } 
                else if (index===1) {
                  // extraer datos angles
                  this.angulos=this.toArrayIndexer(arrayData[index]);
                  this.toFracturaData(this.angulos);
                }
                else if (index===7) {
                  // extraer datos vetillas
                  this.vet=this.toArrayIndexer(arrayData[index]);
                  this.toVetillaData(this.vet);
                } 
                else if (index===2) {
                  // extraer datos lito
                  this.lito=this.toArrayIndexer(arrayData[index]);
                  this.toLitoData(this.lito);
                } 
                else if (index===0) { 
                  // extraer datos alteracion
                  this.alt=this.toArrayIndexer(arrayData[index]);
                  this.toAlterData(this.alt);
                }
                else if (index===4) {
                  // extraer datos mineralizacion
                  this.mnz=this.toArrayIndexer(arrayData[index]);
                  this.toMnzData(this.mnz);
                } 
                else if (index===6) {
                  // extraer datos observacion
                  this.obs=this.toArrayIndexer(arrayData[index]);
                  this.toObsData(this.obs);
                } 

              }
          }
          else{
            console.log("Nothing to show");
          }
          
        });
      }
    });
    
  }


  private async checkChecked():Promise<[boolean, DataProcess[]]>{
    const padre=document.getElementById("idCheck");
    const hijos=padre.getElementsByTagName("input");
    let elements:DataProcess[]=[];
    let check=false;
    for (let index = 0; index < hijos.length; index++) {
      let data=new DataProcess();
      data.nombre=hijos[index].id;
      if(hijos[index].checked){
        data.estado="True";   
        check=true;     
      }
      else{
        data.estado="False";
      }
      elements.push(data);
      
    }
    return [check,elements]
  }

  private toArrayIndexer(object):any[]{
    const dataArray=Object.values(object);
    let finalData=[];
    for (let index = 0; index < dataArray.length; index++) {
      if (typeof(dataArray[index])==="object") {
        finalData.push(Object.values(dataArray[index]))  
      }    
    }
    return finalData;
  }

  private toGeneralData(datos:any[][]){
    if (!this.isEmpty(datos)) {
      for (let index = 0; index < datos[0].length; index++) {
        const general:GeneralData={
          core:datos[0][index],
          start:datos[14][index],
          end:datos[1][index],
          size:datos[13][index],
          rec:datos[10][index],
          ff:datos[3][index],
          frac:datos[4][index],
          esp:datos[2][index],
          rqd:datos[11][index],
          lenS:datos[5][index],
          m:datos[6][index],
          mf:datos[7][index],
          mm:datos[9][index],
          mg:datos[8][index],
          segs:datos[12][index], 
        }
        this.generalDatas.push(general)      
      }
    }
    
  }

  private toMolidoData(datos:any[][]){
    if(!this.isEmpty(datos)){
      for (let index = 0; index < datos[0].length; index++) {
        const molido:MolidoData={
          class:datos[0][index],
          core:datos[1][index],
          from:datos[3][index],
          to:datos[2][index],
        }
        this.molidoData.push(molido);
      }
    }
  }

  private toFracturaData(datos:any[][]){
    if(!this.isEmpty(datos)){
      for (let index = 0; index < datos[0].length; index++) {
        const angulos:FracturaData={
          core:datos[2][index],
          depth:datos[3][index],
          alpha:datos[0][index],
          beta:datos[1][index],
        }
        this.fractData.push(angulos);
      }
    }
  }

  private toVetillaData(datos:any[][]){
    if(!this.isEmpty(datos)){
      for (let index = 0; index < datos[0].length; index++) {
        const vet:VetillaData={
          core:datos[2][index],
          depth:datos[3][index],
          alpha:datos[0][index],
          beta:datos[1][index],
        }
        this.vetData.push(vet);
      }
    }
  }

  private toLitoData(datos:any[][]){
    if(!this.isEmpty(datos)){
      for (let index = 0; index < datos[0].length; index++) {
        const lito:LitoData={
          core:datos[0][index],
          from:datos[1][index],
          to:datos[3][index],
          lito:datos[2][index],
        }
        this.litoData.push(lito);
      }
    }
  }

  private toAlterData(datos:any[][]){
    if(!this.isEmpty(datos)){
      for (let index = 0; index < datos[0].length; index++) {
        const alter:AlterData={
          core:datos[1][index],
          from:datos[2][index],
          to:datos[3][index],
          alt:datos[0][index],
        }
        this.alterData.push(alter);
      }
    }
  }



  private toMnzData(datos:any[][]){
    if(!this.isEmpty(datos)){
      for (let index = 0; index < datos[0].length; index++) {
        const mnz:MinerData={
          core:datos[0][index],
          from:datos[1][index],
          to:datos[3][index],
          min:datos[2][index],
        }
        this.mnzData.push(mnz);
      }
    }
  }

  private toObsData(datos:any[][]){
    if(!this.isEmpty(datos)){
      for (let index = 0; index < datos[0].length; index++) {
        const obs:ObsData={
          core:datos[0][index],
          from:datos[1][index],
          to:datos[3][index],
          obs:datos[2][index],
        }
        this.obsData.push(obs);
      }
    }
  }


  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

}