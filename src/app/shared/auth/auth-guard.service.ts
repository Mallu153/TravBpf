import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { JWTTokenService } from './jwt-token.service';
import { environment } from 'environments/environment';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  /* constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isAuth = this.authService.isAuthenticated();
    if (!isAuth) {
      this.router.navigate(['/pages/login']);
    }
    else {
      return true;
    }
  } */
  constructor(private authService: AuthService, public router: Router, private jwtTokenService: JWTTokenService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.secure(next,state);

  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    return this.secure(next,state);
  }
  private secure(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userToken = this.authService.getSessionCookie();
    const allowedRoles = next.data.allowedRoles;
    const isAuthorized = this.authService.isAuthorized(allowedRoles);
    const isTokenExpired = this.jwtTokenService.isTokenExpired();

    if (userToken || isTokenExpired) {
      /* if (!isAuthorized) {
        this.authService.logout();
        console.log("canActivateChild if");
      } */

      return true;
    }else{

      this.authService.logout();
      return false;
    }
  }
}
