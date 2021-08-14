import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreviewAnalisisService {

  constructor() { }
  private data:object;
  
  setData(data){
    this.data=data;
    console.log(this.data);
  }

}
