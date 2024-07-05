import { ChangeDetectionStrategy, Component , inject ,OnInit, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
    standalone:true,
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [ReactiveFormsModule, FormsModule, MatButtonModule, HttpClientModule,CommonModule]

})
export class RegisterComponent {
    httpClient = inject(HttpClient);
    errorMessage: string | null = null;
    successMessage: string | null = null;
    showForm = true;  // This controls the form visibilit
    constructor( ) { }
    private apiUrl = 'http://localhost:5210/api/Account/Register';
    // http = inject(HttpClient);
    onSubmit(registerForm: any) {

      if (registerForm.valid) {
        this.httpClient.post(this.apiUrl, registerForm.value).subscribe({
          next: (response) =>{
            console.log('Registration successful', response)
            this.errorMessage = ""; // Specific error message from backend
            this.successMessage = "We have sent a confirmation email. Please confirm your email to log in.";
            this.showForm = false;  // Hide the form and other content
          } ,
          error: (error) =>{
            this.errorMessage = "Failed to register. Please try again.";
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message; // Specific error message from backend
          }
            console.error('Error during registration', error)}
        });
      } else {
        console.error('Form is not valid');
      }
}

}
