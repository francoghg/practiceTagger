import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRouterModule } from './admin-routing.module';
import { MainAdminComponent } from './main-admin/main-admin.component';
import { SidemenuAdminComponent } from './sidemenu-admin/sidemenu-admin.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { CompanyAdminComponent } from './company-admin/company-admin.component';
import { DrillingAdminComponent } from './drilling-admin/drilling-admin.component';
import {MatSidenavModule} from '@angular/material/sidenav'
import { TaggerModule } from '../tagger/tagger.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
  MainAdminComponent,
  SidemenuAdminComponent,
  UserAdminComponent,
  CompanyAdminComponent,
  DrillingAdminComponent],
  imports: [
    CommonModule,
    AdminRouterModule,
    MatSidenavModule,
    TaggerModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class AdminModule { }
