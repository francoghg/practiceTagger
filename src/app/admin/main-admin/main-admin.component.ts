import { Component, OnInit } from '@angular/core';
import { SidemenuServiceService } from '../sidemenu-admin/sidemenu-service.service';

@Component({
  selector: 'app-main-admin',
  templateUrl: './main-admin.component.html',
  styleUrls: ['./main-admin.component.css']
})
export class MainAdminComponent implements OnInit {

  constructor(
    public sideService:SidemenuServiceService
  ) { }

  ngOnInit(): void {
  }

}
