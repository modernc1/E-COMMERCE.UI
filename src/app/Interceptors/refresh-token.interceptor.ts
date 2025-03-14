import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from '../components/auth/service/auth.service';
import { LoginResponse } from '../components/auth/DTO/loginResponse';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private apiUrl = `${environment.apiUrl}/auth/RefreshToken`
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient,
    private authService: AuthService,

  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) : Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe( //if there is 401 error refresh the token otherwise do nothing
      catchError(error => {
        if(error.status === 401){
          return this.handle401Error(request, next)
        }
        return throwError(() => error)
      })
    )
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      // No refresh token available, force logout
      return throwError(() => new Error('No refresh token available'));
    }

    if(!this.isRefreshing){
      console.log('refresh is invalid')
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken(refreshToken)
      .pipe(
        switchMap((response: LoginResponse) => {
          if(!response.token || !response.refreshToken){
            return throwError(() => new Error('No Tokens stored'))
          }
          localStorage.setItem('token', response.token)
          localStorage.setItem('refreshToken', response.refreshToken)

          this.authService.setUser({
            fullName: response.fullName,
            email: response.email,
            role: response.role
          })

          // Notify queued requests that we have a new token
          this.refreshTokenSubject.next(response.token)
          this.isRefreshing = false
          return next.handle(this.addToken(req, response.token!))
        }),
        catchError((error) => {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          this.isRefreshing = false
          return throwError(() => error)
        }),
        finalize(() => {
          this.authService.setUser(null)
          this.isRefreshing = false; // Ensures this is reset even on errors
        })
      );
    }else{
      // If refresh is already in progress, wait for the new token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(req, token!)))
      )
    }
  }

  //This function clones the request and adds the new token to it.
  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
}
