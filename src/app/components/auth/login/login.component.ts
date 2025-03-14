import { Component, OnDestroy } from '@angular/core';
import { LoginUser } from '../DTO/loginUser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../../../shared/ErrorHandling/error-component';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ErrorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy{
  keepSignedIn: boolean = false;
  model: LoginUser = {
    email: '',
    password: ''
  }
  backendError? : string
  showPassword: boolean = false;
  private Subscriptions: Subscription[] = [];

  constructor(private authService: AuthService,
    private router: Router,

  ){}

  togglePassword(){
    this.showPassword = !this.showPassword
  }

  onFormSubmit(){
    const sb1 = this.authService.loginUser(this.model).subscribe({
      next: response => {
        if(response.success){
          localStorage.setItem('token', response.token!)
          localStorage.setItem('refreshToken', response.refreshToken!)
          this.authService.setUser(response)
          this.router.navigateByUrl('/home')
        }
      },
      error: (err) => {
        const errors = err as HttpErrorResponse
        this.backendError = errors.error?.['message']

      }
    })

    this.Subscriptions.push(sb1);
  }

  ngOnDestroy(): void {
    this.Subscriptions.forEach(sb => {sb.unsubscribe()})
  }
}
