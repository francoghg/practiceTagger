import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon'
import {MatInputModule} from '@angular/material/input'


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    HomeRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
    
  ],
})
export class HomeModule { }
