import { ChangeDetectionStrategy, Component , inject ,OnInit, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ViewDialogComponent} from "./view-dialog/view-dialog.component"
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

export let carToView:Cars;
export let carToRent:Cars;

export interface Cars {
  id: number;
  model:string;
  plateNumber:string;
  chassisNumber:string;
  color: string;
  description:string;
  yearModel: number;
    fuelType: string;
    pricePerDay: number;
    odometer: number;
    fuelBar: number;
    manufacturer: string;
    isStarred? : boolean;
    whishListId? : number;
    carId:Number;
    customerId:number;
    image:string;
}

@Component({
  selector: 'app-display-cars',
  standalone: true,
  imports: [HttpClientModule,MatButtonModule,MatDialogModule,RouterModule,CommonModule],
  templateUrl: './display-cars.component.html',
  styleUrl: './display-cars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayCarsComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);

  httpClient = inject(HttpClient);
  public cars = signal<Cars[]>([]);


  private customerId: number   
  constructor(){
    const storedId = localStorage.getItem("id");
    this.customerId = storedId !== null ? parseInt(storedId, 10) : 0;
    this.getAllCars();
  }

  carView(car:Cars){
    carToView = car;
  }


  openDialog(car:Cars) {
    carToView = car;
    const dialogRef = this.dialog.open(ViewDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getAllCars(){
    this.httpClient.get<Cars[]>('http://localhost:5210/GetAllActiveCars')
    .subscribe({
      next: (data: Cars[]) => {
        this.cars.set(data);
      },
      error: (err) => console.error(err)
    });
  }


  getallwishes(): Observable<Cars[]> {
    return this.httpClient.get<Cars[]>('http://localhost:5210/api/Wishlist/2PropList');
  }
  

  ngOnInit() {
    this.getAllCars();

  }
  carRent(car:Cars){
    carToRent = car;
    this.router.navigate(['/Rent']);
  }

  toggleStar(car: Cars) {
    car.isStarred = !car.isStarred;
    
    if (car.isStarred) 
      this.addCarToWhishlistDB(car);
    if (!car.isStarred) 
      this.RemoveCarFromWhishlistDB(car.whishListId);
}


  addCarToWhishlistDB(car: Cars) {
      const payload = {
        customerId: this.customerId,
        carId: car.id,
        isActive: true
      };
    
      this.getallwishes().subscribe({
        next: (wishes: any[]) => {
          const alreadyExists = wishes.some(
            wish => wish.carId === payload.carId && wish.customerId === payload.customerId
          );
    
          if (!alreadyExists) {
            console.log("Adding new car to wishlist");
    
            this.httpClient.post('http://localhost:5210/api/Wishlist', payload)
              .subscribe({
                next: (response: any) => {
                  console.log('Added to wishlist:', response);
                  car.whishListId = response.id;
                },
                error: (err) => console.error('Error adding car to wishlist', err)
              });
          } else {
            console.log("Car already exists in wishlist");
          }
        },
        error: (err) => {
          console.error('Error fetching wishlist items', err);
        }
      });
    }
    

  RemoveCarFromWhishlistDB(whishListId?:number) {
    this.httpClient.delete(`http://localhost:5210/api/Wishlist/${whishListId}`)
      .subscribe({
        error: (err) => console.error('Error adding car to wishlist', err)
      });
  }

  rentCar(carId: number): void {
    this.router.navigate(['/rent', carId]);
  }

}
