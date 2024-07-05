import { Component } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpResponse, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, FormsModule, HttpClientModule, RouterLink, RouterModule, RouterOutlet, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  errorMessage: string | null = null;
  forgetobj: ForgetPAsswordData = { email: ''};
  constructor(private http: HttpClient, private router: Router) {}

  showUsernameError = false;
  showEmailError = false;
  showPasswordError = false;
  onSubmit(): void {
    this.http.post('http://localhost:5210/api/Account/ForgetPassword', this.forgetobj, { observe: 'response' })
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {

            console.log(res.statusText)

          } else {
            this.errorMessage = res.statusText;
            console.log(res.statusText);
          }
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = error.error.errorMessage;
          console.log(error);

        }
      );
  }


  clearError(field: string): void {
    if (field === 'username') {
      this.showUsernameError = false;
    } else if (field === 'email') {
      this.showEmailError = false;
    } else if (field === 'password') {
      this.showPasswordError = false;
    }
  }

  validateField(field: string): void {
    if (field === 'username') {
      this.showUsernameError = this.userNameFormControl.invalid;
    } else if (field === 'email') {
      this.showEmailError = this.EmailFormControl.invalid;
    } else if (field === 'password') {
      this.showPasswordError = this.passwordFormControl.invalid;
    }
  }

  userNameFormControl = new FormControl('', [Validators.required]);
  EmailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
}
export class ForgetPAsswordData {

  email: string;


  constructor() {
    this.email = "";

  }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
