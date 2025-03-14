import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorComponent } from '../../../shared/ErrorHandling/error-component';
import { RegisterUser } from '../DTO/registerUser';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ErrorComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {
  model: RegisterUser = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  keepSignedIn: boolean = false;
  firstName: string = ''
  lastName: string = ''
  Subscriptions: Subscription[] = []
  backendError?: string
  constructor(private authService: AuthService,
    private router: Router
  ){}

  get confirmPasswordError(): boolean {
    return this.model.password !== this.model.confirmPassword;
  }

  showPassword = false;         // Toggle for password visibility
  showConfirmPassword = false;  // Toggle for confirm password visibility


  togglePassword(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onFormSubmit(){
    this.model.fullName = this.firstName + ' ' + this.lastName
    const sb1 = this.authService.registerNewUser(this.model).subscribe({
      next: response => {
        this.router.navigateByUrl('/home')
      },
      error: err => {
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
