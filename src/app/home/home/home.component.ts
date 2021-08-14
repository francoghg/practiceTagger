import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import * as bcrypt from 'bcryptjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router:Router,
    private homeService:HomeService
    
  ){

  }
  
  
ngOnInit(): void {

}
  hide=true;

async logIn(){
  const nombre="Yolo";
  const password="123";
  (await this.homeService.auth(nombre))
    .subscribe(resp => {
      console.log("comparacion: ",bcrypt.compareSync(password,resp.password));

      if(bcrypt.compareSync(password,resp.password)){
        console.log("entre");
        // this.router.navigate(['./tagger'])
      }
    });
  
}

async guardar(logInForm:NgForm){
  if(logInForm.valid){
    (await this.homeService.auth(logInForm.value.user))
    .subscribe(resp => {
      console.log(resp);
      if(bcrypt.compareSync(logInForm.value.pass,resp.password)){
        // console.log("entre");
        this.router.navigate(['./tagger'])
      }
      else{
        console.log("Contraseña incorrecta");
      }
    });
  }
  
}

  


}

