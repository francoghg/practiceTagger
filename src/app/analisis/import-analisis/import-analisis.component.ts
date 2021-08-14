import { Component, OnInit } from '@angular/core';
import { ImportAnalisisService } from './import-analisis.service';
import { DataProcess } from './import-analisis';

@Component({
  selector: 'app-import-analisis',
  templateUrl: './import-analisis.component.html',
  styleUrls: ['./import-analisis.component.css']
})
export class ImportAnalisisComponent implements OnInit {

  constructor(
    public importService:ImportAnalisisService,
  ) { }

  ngOnInit(): void {
  }
  
  file=''||"No ha seleccionado ningún archivo";
  
  load(files){
    
    if(files.length===0){
      this.file='';
      return;
    }

    this.file=files[0].name
    const type=files[0].type;
    if(type.localeCompare("application/vnd.ms-excel")!=0){
      return;
    }
    this.importService.setFile(files[0]);    
  }
  
  reviewProcess(){
    this.importService.resetReview()
    this.importService.setReviewReady("False")
    this.importService.postReview();
    this.showReview("myNotestitle");
    this.showReview("myNotes");
    this.showReview("myReview");
  }

  showReview(id) {
    var x = document.getElementById(id);
    if (x.style.display === "none") {
      x.style.display = "block";
    }
  }

  process(){
    this.importService.post();    
  }

  async syncFunction(x) {
    const a = await this.resolveAfter2Seconds(20);
    const b = await this.resolveAfter2Seconds(30);
    return x + a + b;
  }
  resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 1);
    });
  }

  setCorename(corename){
    this.importService.setCorename(corename);
  }

  setRatio(ratio){
    this.importService.setRatio(ratio);
  }

}
