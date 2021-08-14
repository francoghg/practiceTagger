import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainAnalisisComponent } from './main-analisis/main-analisis.component';
import { PreviewAnalisisComponent } from './preview-analisis/preview-analisis.component';
import { ExportAnalisisComponent } from './export-analisis/export-analisis.component';
import { ImportAnalisisComponent } from './import-analisis/import-analisis.component';
import { TaggerModule } from '../tagger/tagger.module';
import { AnalisisRoutingModule } from './analisis-routing.module';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    MainAnalisisComponent,
    PreviewAnalisisComponent,
    ExportAnalisisComponent, 
    ImportAnalisisComponent],
  imports: [
    CommonModule,
    AnalisisRoutingModule,
    TaggerModule,
    MatTableModule
  ],
})
export class AnalisisModule { }
