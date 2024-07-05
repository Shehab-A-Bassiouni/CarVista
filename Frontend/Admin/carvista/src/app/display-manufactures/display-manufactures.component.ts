import {ChangeDetectionStrategy, AfterViewInit, Component, inject, OnInit , ViewChild } from '@angular/core';
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

import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component'

export interface Manfs {
  id: number;
  name: string;
  description: string;
  logo:string;
}

export let manfIDToDelete = 0;
export let manfToEdit:Manfs;

@Component({
  selector: 'app-display-manufactures',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule,CommonModule,RouterLink,RouterOutlet,RouterModule,AddCarComponent,HttpClientModule, MatFormFieldModule, MatInputModule, MatTableModule , MatPaginatorModule ],
  templateUrl: './display-manufactures.component.html',
  styleUrl: './display-manufactures.component.scss'
})
export class DisplayManufacturesComponent {
  public manfs: Manfs[] = [];
  public dataSource: MatTableDataSource<Manfs> = new MatTableDataSource<Manfs>();


  
  displayedColumns: string[] = ['id', 'image', 'name', 'description' ,'edit' , 'delete'];

  httpClient = inject(HttpClient);
  readonly dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string , element :Manfs): void {
    manfIDToDelete = element.id;
    console.log(manfIDToDelete);
    const dialogRef=  this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    }
  
  );
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllManfs();
      window.location.reload();
      }
    });
  }

  ngOnInit() {
  }

  getAllManfs(){
    this.httpClient.get<Manfs[]>('http://localhost:5210/api/Manufacturers')
    .subscribe({
      next: (data: Manfs[]) => {
        console.log(data);

        this.manfs = data;
        this.dataSource.data = this.manfs;
      },
      error: (err) => console.error(err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private router: Router) {
    this.getAllManfs();

  }


  EditManf(manf:Manfs){
    manfToEdit = manf
  }
}
