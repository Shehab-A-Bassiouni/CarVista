import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-customer-data-dialog',
  templateUrl: './customer-data-dialog.component.html',
  styleUrls: ['./customer-data-dialog.component.scss'],
  imports:[MatDialogModule,CommonModule,HttpClientModule,],
  standalone:true,
})
export class CustomerDataDialogComponent implements OnInit{

  customerData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.fetchCustomerData(this.data.customerId);
  }


  fetchCustomerData(customerId: number): void {
    this.httpClient.get<any>(`http://localhost:5210/api/Account/${customerId}`).subscribe({
      next: (customerData) => {
        this.customerData = customerData; // Assign fetched data to a local property
      },
      error: (err) => {
        console.error('Error fetching customer data:', err);
      }
    });
  }

}
