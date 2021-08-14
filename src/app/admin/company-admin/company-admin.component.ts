import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CompanyService } from './company.service';
import { HomeService } from '../../home/home/home.service';

@Component({
  selector: 'app-company-admin',
  templateUrl: './company-admin.component.html',
  styleUrls: ['./company-admin.component.css']
})
export class CompanyAdminComponent implements OnInit {

  constructor(public companyService:CompanyService,
              public homeService:HomeService) { }
  get user(){
    return this.homeService.user;
  }
  async ngOnInit(): Promise<void> {
    
  }
  changeMode(mode:string){
    this.companyService.setMode(mode);
    this.companyService.clearActive();    
  }

  async editCompany(editForm:NgForm){
    console.log(editForm.value);
    if(editForm.valid){
      let active=this.companyService.getActive();
      console.log(active);
      active.name=editForm.value.name;
      active.rut=editForm.value.rut;
      console.log(active);
      this.companyService.setCompany(active);
      this.companyService.clearActive();
    }
  }



}
