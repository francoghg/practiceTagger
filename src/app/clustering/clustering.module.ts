import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainClusteringComponent } from './main-clustering/main-clustering.component';
import { PreviewClusteringComponent } from './preview-clustering/preview-clustering.component';
import { ExportClusteringComponent } from './export-clustering/export-clustering.component';
import { ImportClusteringComponent } from './import-clustering/import-clustering.component';
import { ClusteringRoutingModule } from './clustering-routing.module';
import { TaggerModule } from '../tagger/tagger.module';
import { ImageClusteringComponent } from './import-clustering/image-clustering/image-clustering.component';
import { FileClusteringComponent } from './import-clustering/file-clustering/file-clustering.component';
import { FeatureClusteringComponent } from './import-clustering/feature-clustering/feature-clustering.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MainClusteringComponent, 
    ImportClusteringComponent, 
    ExportClusteringComponent, 
    PreviewClusteringComponent, 
    ImageClusteringComponent, 
    FileClusteringComponent, 
    FeatureClusteringComponent],
  imports: [
    CommonModule,
    ClusteringRoutingModule,
    TaggerModule,
    FormsModule]
})
export class ClusteringModule { }
