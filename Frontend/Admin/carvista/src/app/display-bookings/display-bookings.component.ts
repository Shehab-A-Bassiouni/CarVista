import {ChangeDetectionStrategy, AfterViewInit, Component, inject, OnInit , ViewChild, signal, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { RouterModule ,Router ,RouterOutlet ,RouterLink  } from '@angular/router';
import {AddCarComponent} from "../add-car/add-car.component"
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { CustomerDataDialogComponent } from './customer-data-dialog/customer-data-dialog.component';
import { EditBookingStatusDialogComponent } from './edit-booking-status-dialog/edit-booking-status-dialog.component';

export interface Booking {
  id: number;
  date: string;
  dateFrom: string;
  dateTo: string;
  paymentType: string;
  state: string;
  carId: number;
  customerId: number;
}

@Component({
  selector: 'app-display-bookings',
  templateUrl: './display-bookings.component.html',
  styleUrls: ['./display-bookings.component.scss'],
  standalone:true,
  imports:[MatButtonModule, MatDividerModule, MatIconModule,CommonModule,RouterLink,RouterOutlet,RouterModule,AddCarComponent,HttpClientModule, MatFormFieldModule, MatInputModule, MatTableModule , MatPaginatorModule,EditBookingStatusDialogComponent]
})

export class DisplayBookingsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'date', 'dateFrom', 'dateTo', 'paymentType', 'state',
    'changeStatus', 'customerData', 'carData'
  ];



  dataSource = new MatTableDataSource<Booking>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.getBookings();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getBookings(): void {
    this.httpClient.get<Booking[]>('http://localhost:5210/api/Booking').subscribe({
      next: (data: Booking[]) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
      }
    });
  }

  openEditStatusDialog(booking: Booking): void {
    console.log(booking);
    const dialogRef = this.dialog.open(EditBookingStatusDialogComponent, {
      width: '350px',
      height: '330px',
      data: { booking: booking }
    });


  
    dialogRef.afterClosed().subscribe(newStatus => {
      if (newStatus) {
        console.log('New status:', newStatus);
        this.getBookings(); 
      }
    });
  }
  

  
  openCustomerDataDialog(customerId: number): void {
    const dialogRef = this.dialog.open(CustomerDataDialogComponent, {
      width: '350px',
      data: { customerId: customerId }, 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with result:', result);
      }
    });
  }
  

  navigateToCustomerDetails(customerId: number): void {
    this.router.navigate(['/customers', customerId]); 
  }

  navigateToCarDetails(carId: number): void {
    this.router.navigate(['/cars', carId]); 
  }
}