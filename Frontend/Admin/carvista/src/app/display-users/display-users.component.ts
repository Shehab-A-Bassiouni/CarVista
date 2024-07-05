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

export interface Users {
  id: number;
  userName: string;
  Email: string;
}



@Component({
  selector: 'app-display-users',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule,CommonModule,RouterLink,RouterOutlet,RouterModule,AddCarComponent,HttpClientModule, MatFormFieldModule, MatInputModule, MatTableModule , MatPaginatorModule ],
  templateUrl: './display-users.component.html',
  styleUrls: ['./display-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayUsersComponent{
  // displayedColumns: string[] = ['id', 'userName', 'Email'];
  // dataSource = new MatTableDataSource<Users>();
  // public users:Users[] = [];

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  // constructor(private httpClient: HttpClient , private dialog: MatDialog , private cdr: ChangeDetectorRef) {}
  // ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginator;
  // }
  // ngOnInit(): void {
  //   this.getAllUsers();
  // }

  // getAllUsers() {
  //   this.httpClient.get<Users[]>('http://localhost:5210/api/Account/AvailableUsers', {
  //     headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' }
  //   }).subscribe({
  //     next: (data: Users[]) => {
  //       console.log(data)
  //          this.users = data;
  //       this.dataSource.data = this.users;
  //     },
  //     error: (err) => console.error('Failed to fetch users:', err)
  //   });
  // }
  // applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }


}
