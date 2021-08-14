import {Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { ImportAnalisisService } from '../import-analisis/import-analisis.service';
import { PreviewAnalisisService } from './preview-analisis.service';


@Component({
  selector: 'app-preview-analisis',
  templateUrl: './preview-analisis.component.html',
  styleUrls: ['./preview-analisis.component.css']
})
export class PreviewAnalisisComponent implements OnInit {

  constructor(
    public importSerive:ImportAnalisisService,
    public previewService:PreviewAnalisisService,
    ) {
    }

  ngOnInit(): void {
  }


  displayedColumns: string[] = ['core','start','end','esp','lens','ff','frac','m','mf','mm','mg','rqd','rec','size','segs'];
  molidoColumns:string[]=['core','from','to','class'];
  fracturaColumns:string[]=['core','depth','alpha','beta']
  vetillaColumns:string[]=['core','depth','alpha','beta']
  alterColumns:string[]=['core','from','to','alt'];
  litoColumns:string[]=['core','from','to','lito'];
  minerColumns:string[]=['core','from','to','min'];
  obsColumns:string[]=['core','from','to','obs'];

  dataSource=this.importSerive.generalDatas;
  dataMolido=this.importSerive.molidoData;
  dataAng=this.importSerive.fractData;
  dataVet=this.importSerive.vetData;
  dataLito=this.importSerive.litoData;
  dataAlt=this.importSerive.alterData;
  dataMin=this.importSerive.mnzData;
  dataObs=this.importSerive.obsData;
  
  showTable(name){
    const buttonCont=document.getElementById('previewButtons');
    let buttons=buttonCont.getElementsByClassName('active-button');
    if (buttons.length>0) {      
      buttons[0].className='inactive-button'
    }
    let element=document.getElementById(name);
    this.importSerive.anaList.forEach(item=>{
      document.getElementById(item.nombre).style.display="none"
    });    
    element.style.display="block";

  }



}
