import { Component, OnInit } from '@angular/core';
import { FileClusteringService } from './file-clustering.service';

@Component({
  selector: 'app-file-clustering',
  templateUrl: './file-clustering.component.html',
  styleUrls: ['./file-clustering.component.css']
})
export class FileClusteringComponent implements OnInit {
  public fileName = ''||"No ha seleccionado ningún archivo";
  public file: any;

  constructor(
    public fileClusteringService:FileClusteringService,
  ) { }

  ngOnInit(): void {
    this.fileName=this.fileClusteringService.getFileName();
    this.file=this.fileClusteringService.getFile();
  }

  load(files){
    
    if(files.length===0){
      return;
    }

    const type=files[0].type;
    if(type.localeCompare("application/vnd.ms-excel")!=0){
      return;
    }

    this.fileName=files[0].name
    this.file=files[0]
    this.fileClusteringService.setFileName(files[0].name);
    this.fileClusteringService.setFile(files[0]); 
    this.fileClusteringService.readDataClustering();   
  }

}