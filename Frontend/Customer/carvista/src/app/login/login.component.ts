import { Component, output } from '@angular/core';
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
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { GlobalsService } from "../globals.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, FormsModule, HttpClientModule, RouterLink, RouterModule, RouterOutlet, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  // Fixed the typo from `styleUrl` to `styleUrls`
})
export class LoginComponent {

  isLogged = output();

  registerClicked = output();

  isRegister(){
    this.registerClicked.emit();
  }

  loginSuccess(){
    this.globals.loggedIn.set(true);
    this.isLogged.emit();
  }
  
  errorMessage: string | null = null;
  loginobj: LoginData = { username: '', email: '', password: '' };

  showUsernameError = false;
  showEmailError = false;
  showPasswordError = false;

  constructor(private http: HttpClient, private router: Router , public globals: GlobalsService) {}

  onSubmit(): void {
    this.http.post('http://localhost:5210/api/Account/login', this.loginobj, { observe: 'response' })
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.router.navigate([""]);
            console.log(res)
            localStorage.setItem("id", res.body.id);
            localStorage.setItem("token", res.body.token);
            localStorage.setItem("roles", res.body.roles);
            localStorage.setItem("type", res.body.type);
            this.loginSuccess();
          } else {
            this.errorMessage = res.statusText;
            console.log(res);
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
    }
    else if (field === 'password') {
      this.showPasswordError = this.passwordFormControl.invalid;
    }
  }

  userNameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
}

export class LoginData {
  username: string;
  email: string;
  password: string;

  constructor() {
    this.email = "";
    this.username = "";
    this.password = "";
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
