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



export interface Offer {
  id: number;
  type: string;
  percent: number;
  expiration: Date;
  description: string;
}

export let OfferToEdit:Offer;
export let OfferIDToDelete = 0;


@Component({
  selector: 'app-display-offers',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule,CommonModule,RouterLink,RouterOutlet,RouterModule,AddCarComponent,HttpClientModule, MatFormFieldModule, MatInputModule, MatTableModule , MatPaginatorModule ],
  templateUrl: './display-offers.component.html',
  styleUrls: ['./display-offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayOffersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'type', 'percent', 'expiration', 'description', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Offer>();
  public offers: Offer[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private httpClient: HttpClient, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.getAllOffers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getAllOffers(): void {
    this.httpClient.get<Offer[]>('http://localhost:5210/api/Offer/AvailableOffers', {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' }
    }).subscribe({
      next: (data: Offer[]) => {
        this.offers = data;
        this.dataSource.data = this.offers;
      },
      error: (err) => console.error('Failed to fetch offers:', err)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, element: Offer): void {
    OfferIDToDelete = element.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllOffers();
        window.location.reload();
      }
    });

  }

  editOffer(offer: Offer): void {
    OfferToEdit = offer;
    // this.router.navigate(['/Edit/Offer', offer.id]);
  }
}

