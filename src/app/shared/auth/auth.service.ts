import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENVIRONMENT_MODES } from '../config/development-mode';
@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private static projectKey = 'TRAVEL';
  private userDetails: firebase.User = null;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  serverUrl = environment.USERMANAGEMENT;
  constructor(
    public _firebaseAuth: AngularFireAuth,
    public router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
    public jwtHelper: JwtHelperService
  ) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe((user) => {
      if (user) {
        this.userDetails = user;
      } else {
        this.userDetails = null;
      }
    });
  }

  signupUser(email: string, password: string) {
    //your code for signing up the new user
  }

  signinUser(email: string, password: string) {
    //your code for checking credentials and getting tokens for for signing in user
    // return this._firebaseAuth.signInWithEmailAndPassword(email, password)

    //uncomment above firebase auth code and remove this temp code
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(true);
      }, 1000);
    });
  }

  refreshToken(token: string) {
    return this.http.post(`${this.serverUrl}` + 'auth/refresh-token', {
      token: token
    }, this.httpOptions);
  }

  getUserName(): string {
    const getUser = atob(this.cookieService.get(`${AuthService.projectKey}-AUTH-U`));
    if (getUser) {
      const user = JSON.parse(getUser);
      if (user) {
        return user.userName;
      }
      return '';
    }
    return '';
  }
  getUser() {
    const getUser = atob(this.cookieService.get(`${AuthService.projectKey}-AUTH-U`));
    if (getUser) {
      const user = JSON.parse(getUser);
      if (user) {
        return user.userId;
      }
    }
  }
  logout() {
    this.cookieService.deleteAll('/', 'localhost');
    this.cookieService.deleteAll('/', '.dev.com');
    // this.cookieService.deleteAll('/','manyrx.com');
    window.location.href = environment.LOGINAPP;
  }
  setSessionCookie(token: string) {
    const encryptedToken: string = btoa(escape(token));
    if (encryptedToken) {
      // dev environment setup
      if (environment.ENVIRONMENT_MODE === ENVIRONMENT_MODES.DEVELOPMENT || environment.ENVIRONMENT_MODE === ENVIRONMENT_MODES.UAT) {
        this.cookieService.set(AuthService.projectKey + '-' + 'AUTH-TK', encryptedToken, 1, '/', '.dev.com');
        this.cookieService.set('jrt', token, 1, '/', '.dev.com');
        // localhost setup
      } else if (environment.ENVIRONMENT_MODE === ENVIRONMENT_MODES.LOCALHOST) {
        this.cookieService.set(AuthService.projectKey + '-' + 'AUTH-TK', encryptedToken, 1, '/');
        this.cookieService.set('jrt', token, 1, '/');
      }
      // this.cookieService.set(AuthService.projectKey + '-' + 'SESSION-AUTH-TK', encryptedToken, 1, '/','.manyrx.com', true, 'Strict');
    }
  }

  getRefreshToken(): string {
    const refreshToken = atob(this.cookieService.get(`${AuthService.projectKey}-AUTH-REFRESH-TK`));
    if (refreshToken) {
        return refreshToken;
    }
    return '';
  }

  isAuthenticated() {
    return true;
  }
  getSessionCookie() {
    const sessionToken = atob(unescape(this.cookieService.get(`${AuthService.projectKey}-AUTH-TK`)));
    if (sessionToken) {
      return sessionToken;
    } else {
      return null;
    }
  }
  isAuthorized(allowedRoles: string[]): boolean {
    // check if the list of allowed roles is empty, if empty, authorize the user to access the page
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }
    // get token from local storage or state management
    const token = localStorage.getItem(`${AuthService.projectKey}-AUTH-TK`);

    // decode token to read the payload details
    const decodeToken = this.jwtHelper.decodeToken(token);
    const roleCheck = atob(this.cookieService.get(`${AuthService.projectKey}-AUTH-R`));
    if (!roleCheck) {
      return false;
    }
    const role = JSON.parse(roleCheck);
    return role.some((role: string) => allowedRoles.includes(role));
    // return true;
  }
}
