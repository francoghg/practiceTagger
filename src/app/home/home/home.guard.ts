import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate, CanLoad {
  constructor(private homeservice:HomeService){}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.homeservice.user.id) {
      return true;
    }
    else {      
    console.log("bloqueo activate");return false;
  }
  }

  canLoad(route: Route,segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this.homeservice.user.id) {
      return true;
    }
    else {      
    console.log("bloqueo load");return false;
  }

  }
}
