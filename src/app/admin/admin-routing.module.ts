import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainAdminComponent } from './main-admin/main-admin.component';

const routes:Routes=[
{
    path:'',
    component:MainAdminComponent
},
{
    path:'**',
    redirectTo:''
}
]

@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[
        RouterModule
    ]
})

export class AdminRouterModule{}