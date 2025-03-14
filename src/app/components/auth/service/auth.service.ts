import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterUser } from '../DTO/registerUser';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServiceResponse } from '../../../services/ServerResponse';
import { LoginUser } from '../DTO/loginUser';
import { LoginResponse } from '../DTO/loginResponse';
import { CurrUser } from '../DTO/currUser';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  private userSubject = new BehaviorSubject<CurrUser | null>(null);

  // Expose the user as an observable for components
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  private loadUserFromToken() : CurrUser | null{
    const token = localStorage.getItem('token')
    if(!token){
      return null;
    }

    try{
      const decoded: any = jwtDecode(token);
      const CurrUser: CurrUser = {
        fullName: decoded.FullName,
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      };
      this.userSubject.next(CurrUser)
      return CurrUser;
    }catch(err){
      this.userSubject.next(null)

    }
    return null;
  }

  setUser(CurrUser: CurrUser | null){
    this.userSubject.next(CurrUser);
  }

  getUser(): Observable<CurrUser | null> {
    console.log(this.userSubject.asObservable())
    return this.userSubject.asObservable()
  }

  isAuthenticated() : boolean {
    return this.loadUserFromToken() !== null;
  }

  getUserRole() : string | null{
    const token = localStorage.getItem('token')
    if(token){
      try{
        const decoded: any = jwtDecode(token);
        return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      }catch(err){
        return null;
      }
    }

    return null
  }

  hasRole(role: string): boolean {

    return this.getUserRole() === role;
  }

  updateUser(){
    this.loadUserFromToken();
  }

  registerNewUser(User: RegisterUser) : Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.apiUrl}/Register`, User);
  }

  loginUser(User: LoginUser, keepSignedIn: boolean = false) : Observable<LoginResponse>{

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, User);
  }

  signOut(){
    this.userSubject.next(null);
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }
  refreshToken(refreshToken: string) : Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.apiUrl}/RefreshToken`, refreshToken)
  }

}
