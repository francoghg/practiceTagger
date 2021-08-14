import { Injectable } from '@angular/core';

export interface FeatureI{
  name:string,
  showName:string,
}

@Injectable({
  providedIn: 'root'
})
export class FeatureClusteringService {
    private selectedFeature: 'p1';
    private features:FeatureI[] =[
      {name:'p1',showName:'Litología'},
      {name:'p2',showName:'Alteración'},
      {name:'p3',showName:'Mineralización'}
    ];
    
    getSelectedFeature(){
      return this.selectedFeature;
    }

    getFeatures(){
      return this.features;
    }

    setSelectedFeature(feature){
      this.selectedFeature=feature;
    }

}