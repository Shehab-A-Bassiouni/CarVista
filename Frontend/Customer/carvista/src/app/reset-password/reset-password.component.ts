import { ChangeDetectionStrategy, Component , inject ,OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-reset-password',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, FormsModule, HttpClientModule, RouterLink, RouterModule, RouterOutlet, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  errorMessage: string | null = null;
  resettobj: ResetPAsswordData = { password: '', confirmpassword:'', email:'', token:''};
  constructor(private http: HttpClient, private router: Router) {}

  showUsernameError = false;
  showEmailError = false;
  showPasswordError = false;
  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const token = params['token'];
      if (email && token) {
        this.resettobj.email = email;
        this.resettobj.token = token;
      } else {
        this.showEmailError = true;
        this.errorMessage = "Invalid data";
      }
    });
  }
  onSubmit(): void {
    if (this.resettobj.password != this.resettobj.confirmpassword){

      this.showPasswordError = true;
      this.errorMessage = "Passwords Does not match";
      return;
    }

    this.http.post('http://localhost:5210/api/Account/ResetPassword', this.resettobj, { observe: 'response' })
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
export class ResetPAsswordData {

  password: string;
  confirmpassword: string;
  email :string;
  token: string;


  constructor() {
    this.password = "";
    this.confirmpassword = "";
    this.email = '';
    this.token = '';

  }
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

