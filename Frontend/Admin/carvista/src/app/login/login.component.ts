import {Component, output} from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule ,FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})



export class LoginComponent {

  isLogged = output();

  loginSuccess(){
    this.isLogged.emit();
  }

  loginobj:LoginData;
  errorMessage: string |null = null;
  Login(): void {
    console.log(this.loginobj);
    this.http.post('http://localhost:5210/api/Account/login', this.loginobj, { observe: 'response' })
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.router.navigate([""]);
            console.log(res)
            localStorage.setItem("id" ,res.body.id );
            localStorage.setItem("token" ,res.body.token );
            localStorage.setItem("roles" ,res.body.roles );
            localStorage.setItem("type" ,res.body.type );
            this.loginSuccess()
          } else {
            this.errorMessage = res.statusText;
            console.log(res);
          }
        },
        (error: any) => {
          this.errorMessage = error.error;
          console.error(error);
        }
      );
  }

  constructor(private router: Router , private http:HttpClient) {
    this.loginobj = {username : "" , email : "" , password : ""}
  }
  userNameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
export class LoginData{
  constructor(public username:string , public email:string , public password:string) {
    username = "";
    email = "";
    password = "";
  }
}
