import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class FileClusteringService {
  private fileName = ''||"No ha seleccionado ningún archivo";  
  private file:any;
  constructor(private papa:Papa) { }
  private dataLito: any;
  private dataAlt: any;
  private dataMin: any;

    getFileName(){
      return this.fileName
    }

    getFile(){
      return this.file
    }

    setFileName(fileName:string){
      this.fileName=fileName;
    }

    setFile(file){
        this.file=file;
    }
    
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    readDataClustering(){
      if(this.file==null){
        return;
      }
      var posDataLito = [];
      var posDataAlt = [];
      var posDataMin = [];
      this.papa.parse(this.file,{
        header:true,
        step: function(row){
          posDataLito.push(row.data["p1"])
          posDataAlt.push(row.data["p2"])
          posDataMin.push(row.data["p3"])
        },
        complete: parsedData => {
          this.dataLito = posDataLito.filter(this.onlyUnique);
          this.dataAlt = posDataAlt.filter(this.onlyUnique);
          this.dataMin = posDataMin.filter(this.onlyUnique);
          console.log(this.dataLito);
          console.log(this.dataAlt);
          console.log(this.dataMin);
        }
      });
      
    }
}