import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../home/home/home.service';
import { User } from '../../home/home/home-inbterfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  get user(){
    return this.homeService.user;
  }

  constructor( private homeService:HomeService) { }
  
  
  ngOnInit(): void {
  }

}
