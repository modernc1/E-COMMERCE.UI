import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, AbstractControlDirective, NgModel } from '@angular/forms';

@Component({
    imports: [CommonModule, ],
    selector: 'app-error-component',
    templateUrl: 'error-component.html',
    styleUrls: ['error-component.css']
})

export class ErrorComponent {
  @Input() controlModel!: NgModel | null;

  @Input() control!: AbstractControl | null; // Accepts form control

  @Input() customErrors: { [key: string]: string } = {}; // Custom error messages

  get errorMessage(): string | null {
    if (this.control && this.control.errors && this.control.touched){
      for (const errorKey in this.control.errors){
      if (this.customErrors[errorKey]) {
        return this.customErrors[errorKey]; // Use custom message if provided
      }
      switch (errorKey) {
        case 'required':
          return 'This field is required.';
        case 'minlength':
          return `Minimum length is ${this.control.errors['minlength'].requiredLength} characters.`;
        case 'maxlength':
          return `Maximum length is ${this.control.errors['maxlength'].requiredLength} characters.`;
        case 'email':
          return 'Invalid email format.';
        case 'pattern':
          return 'Invalid format.';
        default:
          return 'Invalid field.';
      }
    }
  }

  if (this.controlModel && this.controlModel.errors && this.controlModel.touched){
    for (const errorKey in this.controlModel.errors){
    if (this.customErrors[errorKey]) {
      return this.customErrors[errorKey]; // Use custom message if provided
    }
    switch (errorKey) {
      case 'required':
        return 'This field is required.';
      case 'minlength':
        return `Minimum length is ${this.controlModel.errors['minlength'].requiredLength} characters.`;
      case 'maxlength':
        return `Maximum length is ${this.controlModel.errors['maxlength'].requiredLength} characters.`;
      case 'email':
        return 'Invalid email format.';
      case 'pattern':
        return 'Invalid format.';
      default:
        return 'Invalid field.';
    }
  }
}
    return null;
  }
}
