import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeGuard } from './home/home/home.guard';

/*
const routes: Routes = [
  {
    path:'home',
    loadChildren:()=>import('./home/home.module').then(m=>m.HomeModule)
  },
  {
    path:'tagger',
    loadChildren:()=>import('./tagger/tagger.module').then(m=>m.TaggerModule),
    // canLoad:[HomeGuard],
    // canActivate:[HomeGuard]
  },
  {
    path:'analisis',
    loadChildren:()=>import('./analisis/analisis.module').then(m=>m.AnalisisModule),
    // canLoad:[HomeGuard],
    // canActivate:[HomeGuard]
  },
  {
    path:'clustering',
    loadChildren:()=>import('./clustering/clustering.module').then(m=>m.ClusteringModule),
  },
  {
    path:'admin',
    loadChildren:()=>import('./admin/admin.module').then(m=>m.AdminModule),
    // canLoad:[HomeGuard],
    // canActivate:[HomeGuard]
  },
  {
    path:'**',
    redirectTo:"home",
  }
];
*/

const routes: Routes = [
  {
    path:'',
    loadChildren:()=>import('./tagger/tagger.module').then(m=>m.TaggerModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true,relativeLinkResolution:'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
