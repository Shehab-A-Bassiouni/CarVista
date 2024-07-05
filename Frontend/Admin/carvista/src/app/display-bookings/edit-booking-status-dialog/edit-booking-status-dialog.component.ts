import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-edit-booking-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './edit-booking-status-dialog.component.html',
  styleUrls: ['./edit-booking-status-dialog.component.scss']
})
export class EditBookingStatusDialogComponent {

  selectedStatus: string = 'Pending';

  statusOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Cancelled', value: 1 },
    { label: 'Delivered', value: 2 },
    { label: 'Completed', value: 3 }
  ];

  constructor(
    public dialogRef: MatDialogRef<EditBookingStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  onSave(): void {
    const statusValue = this.statusOptions.find(option => option.label === this.selectedStatus)?.value;
    if (statusValue === undefined) {
      console.error('Invalid status selected');
      return;
    }

    const url = `http://localhost:5210/api/Booking/UpdateBookingState/${this.data.booking.id}?status=${statusValue}`;
    this.http.put(url, {}).subscribe({
      next: () => {
        this.dialogRef.close(this.selectedStatus);
        console.log('Booking status updated successfully');
      },
      error: (err) => {
        console.error('Error updating booking status:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}