import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';
import { RouterModule, Router, RouterOutlet, RouterLink } from '@angular/router';


export interface CompletedBooking {
  id: number;
  bookNum: string;
  date: Date;
  dateFrom: Date;
  dateTo: Date;
  state: string;
  paymentType: string;
  customerId: number;
  carId: number;
  carModel: string;
  carPlateNumber: string;
  image: string;
  yearModel: number;
}

@Component({
  selector: 'app-past-rents',
  templateUrl: './past-rents.component.html',
  styleUrls: ['./past-rents.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    RouterLink, RouterModule, RouterOutlet
  ],
  providers: [DatePipe]
})

export class PastRentsComponent implements OnInit {
  completedBookings: MatTableDataSource<CompletedBooking> = new MatTableDataSource<CompletedBooking>();

  theImage = signal<string>("");

  constructor(private http: HttpClient, private datePipe: DatePipe, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    const userId = localStorage.getItem("id");
    const parsedUserId = userId !== null ? +userId : 0;
    this.getCompletedBookings(parsedUserId);
  }

  getCompletedBookings(userId: number): void {
    if (userId === 0) {
      console.error('User ID not found in localStorage');
      return;
    }
  
    this.http.get<CompletedBooking[]>(`http://localhost:5210/api/Booking/userbookings/${userId}`).subscribe(
      
      bookings => {
        this.completedBookings.data = bookings;
        console.log(bookings);
      },
      error => {
        console.error('Error fetching completed bookings:', error);
      }
    );

  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  addReview(bookingId: number): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '1000px',
      height:'400px',
      data: { comment: '', rate: 5 ,bookingId : bookingId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Review data:', result);
      }
    });
  }
  
  goToCarDetails(carId: number): void {
    this.router.navigate(['/product-details', carId]);
  }

}
