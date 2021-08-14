import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainAnalisisComponent } from './main-analisis/main-analisis.component';

const routes:Routes=[
  {
    path:'',
    component:MainAnalisisComponent
  },
  {
    path:'**',
    redirectTo:''
  }

]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AnalisisRoutingModule { }
