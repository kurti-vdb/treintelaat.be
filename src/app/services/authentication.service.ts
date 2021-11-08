import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "../models/user";
import { clearTimeout, setTimeout } from 'timers';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private token!: string;
  private isAuthenticated = false;
  private isSocialLogin = false;
  private tokenTimer!: number;
  private authStatusListener = new Subject<boolean>();
  private flashMessageListener = new Subject<any>();

  public response: any;
  private responseListener = new Subject<any>();

  private user!: User;
  private userUpdated = new Subject<User>();

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }

  getToken()  {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsSocialLogin() {
    return this.isSocialLogin;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getflashMessageListener() {
    return this.flashMessageListener.asObservable();
  }

  getUser() {
    return this.user;
  }

  getResponse() {
    return this.response;
  }

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post<any>(environment.apiUrl + '/api/user/signup', { email, password })
      .pipe(
        catchError (err => {
          return throwError(err); // is also an observable
        }),
        tap(response => {
          this.processLoginResponse(response, false);
      }));
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string, expiresIn: number, user: any }>(environment.apiUrl + '/api/user/login', { email, password })
      .pipe(
        catchError (err => {
          return throwError(err); // is also an observable
        }),
        tap(response => {
          this.processLoginResponse(response, false);
      }));
  }

  googleLogin(googleUser: any) {
    return this.http.post<any>(environment.apiUrl + '/api/user/auth/google', googleUser)
      .pipe(
        catchError (err => {
          return throwError(err); // is also an observable
        }),
        tap(response => {
          this.processLoginResponse(response, true);
      }))
  }

  facebookLogin(facebookUser: any) {
    return this.http.post<any>(environment.apiUrl + '/api/user/auth/facebook', facebookUser)
      .pipe(
        catchError (err => {
          return throwError(err); // is also an observable
        }),
        tap(response => {
          this.processLoginResponse(response, true);
      }))
  }

  autoLogin() {
    const authInfo = this.getAuthData();

    if(!authInfo) { return; }

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
      this.user = authInfo.user;
      this.userUpdated.next({...this.user});
    }
  }

  private processLoginResponse(response: any, isSocialLogin: boolean) {

    if (!response.token) { return; }

    this.token = response.token;
    if(response.token) {
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.user = response.user;
      this.user.isSocialLogin = isSocialLogin;
      this.userUpdated.next({...this.user});
      this.isAuthenticated = true;
      this.isSocialLogin = isSocialLogin;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(response.token, expirationDate, this.user);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, user: User) {
    localStorage.setItem('jwt', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
  }

  private getAuthData() {
    const token = localStorage.getItem('jwt');
    const expirationDate = localStorage.getItem('expiration');
    const user = JSON.parse(localStorage.getItem('user')!);

    if(!token || !expirationDate) { return; }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      user: user
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = window.setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getUserByID(id: string) {
    return this.http.get<any>(environment.apiUrl + '/api/user/id/' + id).subscribe(response => {
      this.user = response.user;
      this.userUpdated.next({...this.user});
    })
  }

  updateUser(user: User) {
    return this.http.put(environment.apiUrl + '/api/user/' + user.id, user)
      .pipe(
        catchError (err => {
          return throwError(err); // is also an observable
        }),
        tap(response => {
          this.flashMessageListener.next(response);
          this.processLoginResponse(response, this.isSocialLogin);
      }));
  }

  logout() {
    this.token = "";
    this.user = null!;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    window.clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  public emailExists (email: string): Observable<[]> {
    let response: Observable<[]> = this.http.post<any>(environment.apiUrl + '/api/user/findemail', { email });
    return response;
  }

  getDelays() {
    this.http.get<any>(environment.apiUrl + '/api/user/delays').subscribe(delays => {
      return delays;
    })
  }
}
