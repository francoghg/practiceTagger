import { Component, OnInit } from '@angular/core';
import { ImageAdderService } from '../imagebar/imagebar.service';
import { DrawsService } from '../draws/draws.service';
import {Papa} from 'ngx-papaparse'

import { sidebarService } from '../sidebar/sidebar.service';
import { ActiveShape, Clase, ShapeContainer, altLine } from '../draws/draws-class';
import Line from '../../../assets/source/elements/svg/line';
import Rectangle from '../../../assets/source/elements/svg/rectangle';

@Component({
  selector: 'app-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.css']
})
export class ImportsComponent implements OnInit {

  constructor(public imageService: ImageAdderService, 
              public drawsService: DrawsService,
              public sidebarService:sidebarService,
              private papa:Papa) { }

  ngOnInit(): void {
  }

  resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, x);
    });
  }
  
  
  async syncFunction(x) {
    const a = await this.resolveAfter2Seconds(x);
    const b = await this.resolveAfter2Seconds(x);
    return x + a + b;
  }

  exportData(){
    let pass=false;
    this.drawsService.shapeContainer.forEach(element=>{
      if(element.shapeList.length>=1){
        pass=true;
      }
    })
    if(this.drawsService.activesShapes.length>=1 || pass){   
      this.drawsService.exportData(this.imageService.img.name);
    }
    else console.log("Nada que exportar");
  }
  
  loadCSV(files){
    console.log(files);
    if(files.length===0){
      return;
    }
    const type=files[0].type;
    if(type.localeCompare("application/vnd.ms-excel")!=0){
      return;
    }
    let csvData=[];
    let header=[];
    let counter=0;
    this.papa.parse(files[0], {
      // header true->ignora el header del archivo
      header: false, 
      step:function (results) {
        if(counter!=0){
          if(results.data!=""){
            csvData.push(results.data);
          }
        }
        else{
          header.push(results.data);
        }
        counter++;
        
      }
    });
    this.syncFunction(500).then(v=>{   
      // recorrer el data para crear entradas 
      // en el shapecontainer
      this.createFrames(csvData).then(() => {
         // si la imagen activa es la que contiene datos, se dibujan directamente, sino
      // se almacenan en el shape container
        csvData.forEach(csvelement=>{
          if(!this.isEmpty(this.imageService.img)){
            // Revisa si la imagen cargada es la misma que esta contenida
            if(this.imageService.img.name.localeCompare(csvelement[0])===0){
              this.loadFill(csvelement);
            }
            else{
              this.loadEmpty(csvelement);
            }
          }
          
          // Si no hay imagen activa
          else{
            this.loadEmpty(csvelement);
          } 
          
        })
      });     

    })

  }

   isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  loadEmpty(csvelement){
    this.drawsService.shapeContainer.forEach(containerElement=>{
      // si pertenece a la imagen, se crea el elemento
      if(csvelement[0].localeCompare(containerElement.imgName)===0){
        let temporal= new ActiveShape();
        let factor=1400/(containerElement.width);
        temporal.imgName=csvelement[0];
        temporal.activo=true;            
        temporal.clase=csvelement[3];
        temporal.shapeType=csvelement[4];
        let rawData=csvelement[5].replace("{","");        
        rawData=rawData.replace("}","");
        rawData=rawData.replace(/\"/g,"");
        temporal.atribute=rawData;
        temporal.color=csvelement[11];
        temporal.shapeLine=[];
        if(temporal.shapeType.localeCompare("box")===0){          
          let x=Math.floor(factor*csvelement[7]);
          let y=Math.floor(factor*csvelement[8]);
          let width=Math.floor(factor*csvelement[9]);
          let height=Math.floor(factor*csvelement[10]);
          temporal.shape=new Rectangle(x,y,width,height);
        }
        else if(temporal.shapeType.localeCompare("line")===0){
          let rawX=csvelement[7].replace(/\"/g,"");              
          let rawY=csvelement[8].replace(/\"/g,""); 
          let linesXPoints=this.drawsService.splitAtributeDataService(rawX,",");
          let linesYPoints=this.drawsService.splitAtributeDataService(rawY,",");
          let lineCounter=(linesXPoints.length/2);                      
          for (let index = 0; index < linesXPoints.length; index+=2) {
            
            let x1=Math.floor(parseInt(linesXPoints[index])*factor);
            let x2=Math.floor(parseInt(linesXPoints[index+1])*factor);
            let y1=Math.floor(parseInt(linesYPoints[index])*factor);
            let y2=Math.floor(parseInt(linesYPoints[index+1])*factor);
            let tempLine= new Line(x1,y1,x2,y2);
            temporal.shapeLine.push(tempLine)

          }            
          // console.log(temporal.shapeLine);
          temporal.lines=lineCounter.toString();
        }
        else if(temporal.shapeType.localeCompare("arrow")===0){
          let x=Math.floor(factor*csvelement[7]);
          let y=Math.floor(factor*csvelement[8]);
          temporal.shape=new Rectangle(x,y,0,0);
        }
        containerElement.shapeList.push(temporal);

      }

    });
  }
  loadFill(csvelement){
    let temporal= new ActiveShape();
    let factor=1400/parseInt((this.imageService.complexImg.width));
    temporal.imgName=csvelement[0];
    temporal.activo=true;            
    temporal.clase=csvelement[3];
    temporal.shapeType=csvelement[4];
    let rawData=csvelement[5].replace("{","");        
    rawData=rawData.replace("}","");
    rawData=rawData.replace(/\"/g,"");
    temporal.atribute=rawData;
    temporal.color=csvelement[11];
    temporal.shapeLine=[];

    if(temporal.shapeType.localeCompare("box")===0){
      
      let x=Math.floor(factor*csvelement[7]);
      let y=Math.floor(factor*csvelement[8]);
      let width=Math.floor(factor*csvelement[9]);
      let height=Math.floor(factor*csvelement[10]);
      
      temporal.shape=new Rectangle(x,y,width,height)
    }
    else if(temporal.shapeType.localeCompare("line")===0){
      let rawX=csvelement[7].replace(/\"/g,"");              
      let rawY=csvelement[8].replace(/\"/g,""); 
      let linesXPoints=this.drawsService.splitAtributeDataService(rawX,",");
      let linesYPoints=this.drawsService.splitAtributeDataService(rawY,",");
      let lineCounter=(linesXPoints.length/2);                      
      for (let index = 0; index < linesXPoints.length; index+=2) {
        
        let x1=Math.floor(parseInt(linesXPoints[index])*factor);
        let x2=Math.floor(parseInt(linesXPoints[index+1])*factor);
        let y1=Math.floor(parseInt(linesYPoints[index])*factor);
        let y2=Math.floor(parseInt(linesYPoints[index+1])*factor);
        let tempLine= new Line(x1,y1,x2,y2);
        temporal.shapeLine.push(tempLine)

      }            
      // console.log(temporal.shapeLine);
      temporal.lines=lineCounter.toString();
    }
    else if(temporal.shapeType.localeCompare("arrow")===0){
      let x=Math.floor(factor*csvelement[7]);
      let y=Math.floor(factor*csvelement[8]);
      temporal.shape=new Rectangle(x,y,0,0);
      console.log(x,y);
    }
    this.drawsService.crearFromData(temporal);
  }
  async createFrames(csvData: any[]) {
    csvData.forEach(element=>{
      let addImg=true;
      let addclas=true;
      this.drawsService.shapeContainer.forEach(containerElement=>{
        if(element[0].localeCompare(containerElement.imgName)===0){
          addImg=false;
        }

      });
      this.drawsService.clases.forEach(clasElement=>{
        if(element[3].localeCompare(clasElement.name)===0){
          addclas=false;
        }
      });

      if(addImg){
        let container= new ShapeContainer();
        container.imgName=element[0];
        container.height=element[1];
        container.width=element[2];
        container.shapeList=[];
        this.drawsService.shapeContainer.push(container);
      }
      if(addclas){
        let clase= new Clase();
        clase.name=element[3];
        clase.shape=element[4];
        clase.color=element[11];
        let rawData=element[5].replace("{","");        
        rawData=rawData.replace("}","");
        rawData=rawData.replace(/\"/g,"");
        clase.atribute=rawData;
        clase.view=true;
        
        if(clase.shape.localeCompare("box")===0){
          clase.width=60;
          clase.height=60;
        }
        else{
          let linesXPoints=element[7].replace(/\"/g,"")
          linesXPoints=this.drawsService.splitAtributeDataService(linesXPoints,",")
          clase.lines=(linesXPoints.length/2).toString();
        }
        this.drawsService.clases.push(clase);          
      }

    });  
  }


}
