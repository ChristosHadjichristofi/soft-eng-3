import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Services } from '../providers/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private services: Services, private toastr: ToastrService, private router: Router) { }

  
  userRole: string = '';
  canActivate(
    route: ActivatedRouteSnapshot): boolean {
    this.userRole = this.services.getUserRole();

    if (this.userRole == '') {
      this.toastr.error('Unauthorized');
      this.router.navigateByUrl('/login');
      return false;
    }

    let roles = route.data.roles as Array<string>;

    if (!roles.includes(this.userRole)) {
      this.toastr.error("You don't have permission to access this route.");
      
      if (this.userRole == 'stationadmin')
        this.router.navigateByUrl('/stationadmin');
      else if (this.userRole == 'owner')
        this.router.navigateByUrl('/owner');

      return false;
    }
    return true;
  }

}
