import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainClusteringComponent} from './main-clustering/main-clustering.component'

const routes: Routes = [
  {
    path:'',
    component:MainClusteringComponent
  },
  {
    path:'**',
    redirectTo:''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClusteringRoutingModule { }
