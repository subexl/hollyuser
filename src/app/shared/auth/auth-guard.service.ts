import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    console.log('AuthGuard..', currentUser);
     // check sessionTiemout
    const timeout = localStorage.getItem('sessionTimeout');

    if ( !(timeout <  (new Date().getTime()).toString()) && currentUser ) {
      // logged in and session not timed out so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['pages/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}


