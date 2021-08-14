import { Component, OnInit} from '@angular/core';
import { FeatureClusteringService,FeatureI } from './feature-clustering.service';

@Component({
  selector: 'app-feature-clustering',
  templateUrl: './feature-clustering.component.html',
  styleUrls: ['./feature-clustering.component.css']
})
export class FeatureClusteringComponent implements OnInit {
  public selectedFeature: 'p1';
  public features: FeatureI[];

  constructor(
    public featureClusteringService:FeatureClusteringService,
  ) { }

  ngOnInit(): void {
    this.features = this.featureClusteringService.getFeatures();
    this.selectedFeature = this.featureClusteringService.getSelectedFeature(); 
  }

  selectFeature(feature): void {
    this.featureClusteringService.setSelectedFeature(feature);
    this.selectedFeature = feature;
  }
}