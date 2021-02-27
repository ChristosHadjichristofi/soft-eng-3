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
}
