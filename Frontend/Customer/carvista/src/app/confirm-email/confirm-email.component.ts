import { ChangeDetectionStrategy, Component , inject ,OnInit, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { RouterModule ,Router ,RouterOutlet ,RouterLink } from '@angular/router';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],

  standalone:true,
  imports: [ReactiveFormsModule, FormsModule, MatButtonModule, HttpClientModule, RouterModule]
})
export class ConfirmEmailComponent {
  message: string = '';
  isError: boolean = false;

  constructor(

  ) {}
  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      const code = params['code'];
      if (userId && code) {
        this.confirmEmail(userId, code);
      } else {
        this.message = 'Invalid or missing parameters.';
        this.isError = true;
      }
    });
  }

  confirmEmail(userId: string, code: string): void {
    const apiUrl = `${"http://localhost:5210/api/Account"}/ConfirmEmail`;
    this.httpClient.post(apiUrl, {"userId": Number(userId), "code": code}).subscribe({
      next: (response) => {
        this.message = 'Email successfully confirmed!';
        this.isError = false;
      },
      error: (error) => {
        this.message = 'Failed to confirm email.';
        this.isError = true;
        console.error('Error during email confirmation:', error);
      }
    });
  }
}
