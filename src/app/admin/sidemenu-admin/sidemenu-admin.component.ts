import { Component, OnInit } from '@angular/core';
import { SidemenuServiceService } from './sidemenu-service.service';
import { CompanyService } from '../company-admin/company.service';

@Component({
  selector: 'app-sidemenu-admin',
  templateUrl: './sidemenu-admin.component.html',
  styleUrls: ['./sidemenu-admin.component.css']
})
export class SidemenuAdminComponent implements OnInit {

  constructor(    
    private sideService:SidemenuServiceService,
    private companyService:CompanyService
  ) { }

  ngOnInit(): void {
  }
  async setView(value:string){

    this.sideService.setState(value);
    if(value==="company"){
      (await this.companyService.getcompaniesApi())
        .subscribe(resp=>{
          console.log(resp);
        })
    console.log(this.companyService.getCompanies());
  }
}

}
