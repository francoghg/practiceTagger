import { Injectable } from '@angular/core';
import { Company } from './company';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl=environment.baseUrl;
  private company:Company={//Company of the user
    id:1,
    name:"Graiph",
    rut:"76.833.364-5",
    contractEnd:"",
    contractInit:"",
    type:"super"
  } 
  private mode:string="";
  private activeCompany:Company;
  private companies:Company[]; //All the companies (only for graiph)
  
  constructor(
    private http:HttpClient,) { }
  
  setMode(newMode:string){
    this.mode=newMode;
  }
  getMode(){
    return this.mode;
  }
  setCompany(value:Company){
    this.company=value;
  }
  getCompany(){
    return this.company;
  }
  addCompanies(value:Company){
    this.companies.push(value);
  }
  getCompaniesSingle(index:number){
    return this.companies[index];
  }
  getCompanies(){
    return this.companies;
  }
  setActive(value:Company){
    this.activeCompany=value;
  }
  getActive(){
    return this.activeCompany;
  }
  clearActive(){
    this.activeCompany=undefined;
  }

  async getcompaniesApi(){
    console.log("geting");
    return this.http.get<Company[]>(`${this.baseUrl}/company/all`)
    .pipe(
      tap(companies=>{
        this.companies=[];
        companies.forEach(item=>{
          this.companies.push(item);
        })
      })
    )
  }

}
