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

import {DeleteDialogComponent} from "./delete-dialog/delete-dialog.component"

export interface Cars {
  id: number;
  manufacturer: string;
  model: string;
  color: string;
  plateNumber: string;
}

export let CarIDToDelete = 0;
export let CarToEdit:Cars;
export let CarToView:Cars;


@Component({
  selector: 'app-display-cars',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule,CommonModule,RouterLink,RouterOutlet,RouterModule,AddCarComponent,HttpClientModule, MatFormFieldModule, MatInputModule, MatTableModule , MatPaginatorModule ],
  templateUrl: './display-cars.component.html',
  styleUrls: ['./display-cars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayCarsComponent implements OnInit  , AfterViewInit{

  displayedColumns: string[] = ['id', 'image', 'manufacturer', 'model', 'color', 'plateNumber' , 'edit' , 'delete' , 'details'];
  dataSource = new MatTableDataSource<Cars>();
  public cars:Cars[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private httpClient: HttpClient , private dialog: MatDialog , private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAllCars();
   }

   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllCars() {
    this.httpClient.get<Cars[]>('http://localhost:5210/GetAllActiveCars', {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' }
    }).subscribe({
      next: (data: Cars[]) => {
        console.log(data)
           this.cars = data;
        this.dataSource.data = this.cars;
      },
      error: (err) => console.error('Failed to fetch cars:', err)
    });
  }
  
  ViewDetails(car: Cars){
    CarToView = car;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, element: Cars): void {
    CarIDToDelete = element.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllCars();
        window.location.reload();
      }
    });

  }

  EditCar(carEdit: Cars){
    CarToEdit = carEdit;
  }
}