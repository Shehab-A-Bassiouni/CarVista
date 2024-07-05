import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss'],
  standalone:true,
  imports:[ FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,CommonModule]
})
export class ReviewDialogComponent {
  stars: boolean[] = [false, false, false, false, false];
  comment: string = ''; 
  rate: number = 0; 
  commentError: boolean = false; 

  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookingId: number, comment: string, rate: number },
    private http: HttpClient, private snackBar: MatSnackBar
  ) {}

  rateStar(index: number): void {
    this.rate = index + 1;
    this.updateStars(index + 1);
  }

  updateStars(rating: number): void {
    this.stars = this.stars.map((_, index) => index < rating);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {

    if (!this.comment.trim()) {
      this.commentError = true;
      return;
    }

    // Reset error flag
    this.commentError = false;


    this.http.post<any>(`http://localhost:5210/api/Review?bookingId=${this.data.bookingId}&comment=${this.comment}&rate=${this.rate}`,{}
    ).subscribe(
      (response) => {
        console.log('Review added successfully', response);
        this.openSnackBar('Thank you for your review!');
        this.dialogRef.close();
      },
      (error) => {
        console.log(this.data.bookingId+this.comment+this.rate);
        if (error.status === 404) {
          console.error('Booking not found:', error.error);
        } else {
          console.error('Error adding review:', error);
        }
      }
    );
  }
  
  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      verticalPosition: 'top' // Positioning the Snackbar at the top
    });
  }

}