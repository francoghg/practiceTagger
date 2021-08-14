import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidemenuServiceService {
  private state:string="company";
  constructor() { }

  setState(value:string){
    this.state=value;
  }
  getState(){
    return this.state;
  }
}
