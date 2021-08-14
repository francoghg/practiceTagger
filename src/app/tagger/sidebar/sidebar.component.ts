import { Component, OnInit } from '@angular/core';
import { CheckBox } from 'src/assets/source';
import { sidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public sidebarService:sidebarService) { }

  ngOnInit(): void {
  }

  changeDisplay(id):void{
    if(document.getElementById(id).style.display=="none"){
      document.getElementById(id).style.display="block"
    }
    else{
    document.getElementById(id).style.display="none"}
  
  }

  removezoom(){
    this.sidebarService.removeGlass();
  }
  
  magnifier(imgId:string){
    this.sidebarService.magniGlass(imgId);

  }
  activate(){
    this.sidebarService.changeGlass();
  }


}
