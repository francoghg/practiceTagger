import { Component, OnInit } from '@angular/core';
import { ImportAnalisisService } from '../import-analisis/import-analisis.service';
import { ExportToCsv } from 'export-to-csv';




@Component({
  selector: 'app-export-analisis',
  templateUrl: './export-analisis.component.html',
  styleUrls: ['./export-analisis.component.css']
})
export class ExportAnalisisComponent implements OnInit {

  constructor( private importService:ImportAnalisisService) {

   }

  ngOnInit(): void {
  }
  
  export(){
    let exportar=false;
    if (this.importService.generalDatas.length>0) {
      let exportoptions={
        filename:'AnalisisGeotecnia',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };      
      const csvExport=new ExportToCsv(exportoptions);
      csvExport.generateCsv(this.importService.generalDatas);
      exportar=true;
    }

    if (this.importService.molidoData.length>0) {
      let exportoptions={
        filename:'AnalisisMolido',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };      
      const csvExport=new ExportToCsv(exportoptions);
      csvExport.generateCsv(this.importService.molidoData);
      exportar=true;
    }

    if (this.importService.fractData.length>0) {
      let exportoptions={
        filename:'AnalisisFracturas',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };      
      const csvExport=new ExportToCsv(exportoptions);
      csvExport.generateCsv(this.importService.fractData);
      exportar=true;
    }

    if (this.importService.vetData.length>0) {
      let exportoptions={
        filename:'AnalisisVetillas',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };      
      const csvExport=new ExportToCsv(exportoptions);
      csvExport.generateCsv(this.importService.vetData);
      exportar=true;
    }

    if (this.importService.alterData.length>0) {
      let exportoptions={
        filename:'AnalisisAlteracion',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };      
      const csvExport=new ExportToCsv(exportoptions);
      csvExport.generateCsv(this.importService.alterData);
      exportar=true;
    }

    if (this.importService.litoData.length>0) {
      let exportoptions={
        filename:'AnalisisLitologia',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };      
      const csvExport=new ExportToCsv(exportoptions);
      csvExport.generateCsv(this.importService.litoData);
      exportar=true;
    }

    if (this.importService.mnzData.length>0) {
      let exportoptions={
        filename:'AnalisisMineralizacion',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };      
      const csvExport=new ExportToCsv(exportoptions);
      csvExport.generateCsv(this.importService.mnzData);
      exportar=true;
    }

    if (this.importService.obsData.length>0) {
      let exportoptions={
        filename:'AnalisisObservacion',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };      
      const csvExport=new ExportToCsv(exportoptions);
      csvExport.generateCsv(this.importService.obsData);
      exportar=true;
    }

  }
}
