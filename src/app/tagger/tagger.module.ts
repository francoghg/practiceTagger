import { CommonModule } from '@angular/common';
import  { NgModule } from '@angular/core';
import { DrawsComponent } from './draws/draws.component';
import { ImagebarComponent } from './imagebar/imagebar.component';
import { ImportsComponent } from './imports/imports.component';
import { MainComponent } from './main/main.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TaggerRoutingModule } from './tagger-routing.module';


@NgModule({
    imports: [
        CommonModule,
        TaggerRoutingModule
    ],
    exports: [
        NavbarComponent
    ],
    declarations: [
        DrawsComponent,
        ImagebarComponent,
        ImportsComponent,
        MainComponent,
        SidebarComponent,
        NavbarComponent
    ],
    providers: [],
})
export class TaggerModule { }