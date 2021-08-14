import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { environment } from '../../../environments/environment';
import { User } from './home-inbterfaces';
import {tap} from 'rxjs/operators'
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})

export class HomeService {
  private baseUrl=environment.baseUrl;
  private _user:User|undefined;
  get user():User{
    return {...this._user!}
  }
  constructor(
    private http:HttpClient,
    ) { }

  async auth(mail){
    const fromData:User={
      id:"",
      username:"",
      password:"",
      mail:mail,
      type:0
    };
    // const bcpass=this.bcrypt.hash(pass,10);
    // console.log(bcpass);

    const requestOptions={
      method:"POST",
      body:fromData
    }
    return this.http.post<User>(`${this.baseUrl}/login`,fromData)
    .pipe(
      tap(user=>{
        this._user=user;
      })
    );
    
    // return fetch(`${this.baseUrl}/user/Diego`);
    //Autencticar user
    // 
  }

  async create(name,pass,mail,type){
    const salt = bcrypt.genSaltSync(10);
    const passw = bcrypt.hashSync(pass, salt);
    const fromData:User={
      id:'',
      username:name,
      password:passw,
      mail:mail,
      type:type
    };
    return this.http.post<User>(`${this.baseUrl}/user`,fromData)
    

  }
}
