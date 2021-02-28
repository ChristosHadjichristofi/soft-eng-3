import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Services {

  constructor(private router: Router) { }

  isAuthenticated(): boolean {
      if (localStorage.getItem('authToken') != null) return true;
      this.router.navigateByUrl('/login');
      return false;
  }

  getUserRole(): string {
    if (this.isAuthenticated()) {

      let jwtData = localStorage.getItem('authToken').split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      return decodedJwtData.user.role;
    }
    return '';
  }

  getUserName(): string {
    if (this.isAuthenticated()) {

      let jwtData = localStorage.getItem('authToken').split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      return decodedJwtData.user.name;
    }
    return '';
  }


}
