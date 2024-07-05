import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component , inject ,OnInit, signal } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

export let carId:number = 0;

@Component({
  selector: 'app-rent-car',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,RouterModule],
  templateUrl: './rent-car.component.html',
  styleUrl: './rent-car.component.scss'
})




export class RentCarComponent implements OnInit{

  // httpClient = inject(HttpClient);
  // route      = inject(ActivatedRoute);
  // router     = inject(Router);

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private router: Router) {}

  paymentTypeChosen = signal<string>("");
  differenceInDays: number | null = null;
  errorMessage: string | null = null;

  olderPrice: number | null = null;
  pricePerDay: number | null = null;
  Offer: number | null = null;
  currentPrice: number | null = null;

  bookingData = {
    dateFrom: null,
    dateTo: null,
    paymentType: '',
    carId: 0,
    CustomerId: 0,
  };

  getPricePerDay(){
    const carId = this.route.snapshot.paramMap.get('carId');

    this.httpClient.get<any>(`http://localhost:5210/api/Car/${carId}`).subscribe(
        (response) => {
          this.pricePerDay = response.pricePerDay;
        },
        (error) => {
            console.error('Failed to fetch real price:', error);
        }
    );
  }

  getOffer(){
    this.httpClient.get<any>(`http://localhost:5210/api/Offer/last-active`)
    .subscribe(
      (response) => {
        this.Offer = response.percent;
      },
      (error) => {
          console.error('Failed to fetch real price:', error);
      }
  );
  }

  calculatePrice() {
    if (this.bookingData.dateFrom && this.bookingData.dateTo && this.pricePerDay !== null && this.Offer !== null) {
      const dateFrom = new Date(this.bookingData.dateFrom);
      const dateTo = new Date(this.bookingData.dateTo);
      const differenceInDays = ((dateTo.getTime() - dateFrom.getTime()) / (1000 * 3600 * 24));
      this.olderPrice = differenceInDays * this.pricePerDay;
      this.currentPrice = this.olderPrice * (1 - this.Offer / 100);
    }
  }


  ngOnInit(): void {
    this.getPricePerDay();
    this.getOffer();
      this.route.paramMap.subscribe(params => {
      const carIdParam = params.get('carId');
      console.log(carIdParam);
      if (carIdParam !== null) {
        this.bookingData.carId = + carIdParam; 
        carId = this.bookingData.carId;
      } else {
        this.bookingData.carId = 0; 
      }
    });

    const customerId = localStorage.getItem("id");
    this.bookingData.CustomerId = customerId !== null ? +customerId : 0;

    this.route.paramMap.subscribe(params => {
      const carIdParam = params.get('carId');
      console.log(carIdParam);
      if (carIdParam !== null) {
        this.bookingData.carId = +carIdParam;
        carId = this.bookingData.carId;
      } else {
        this.bookingData.carId = 0;
      }
    });
  }


  createBooking() {
    const dateFrom = new Date(this.bookingData.dateFrom!);
    const dateTo = new Date(this.bookingData.dateTo!);
    const differenceInTime = dateTo.getTime() - dateFrom.getTime();
    this.differenceInDays = differenceInTime / (1000 * 3600 * 24);
    this.httpClient.post<any>('http://localhost:5210/api/booking', this.bookingData)
      .subscribe(
        (response) => {
          console.log(this.paymentTypeChosen())
          console.log('Booking created successfully:', response);
          const data = { carid: carId }
          if (this.paymentTypeChosen() == "cash") {
            this.router.navigate(['/Success']);
          } 
          else {
            this.router.navigate(['/Credit'], { queryParams: { carId: carId, days: this.differenceInDays } });
          }
        },
        (error) => {
          console.error('Error creating booking:', error);
         
          if (error.status === 400 && error.error?.errors) {
            const validationErrors = error.error.errors;
            if (validationErrors.DateTo) {
              this.errorMessage = validationErrors.DateTo[0];
              console.log(error.error?.message); 
            } else {
              this.errorMessage = 'Please fill in all fields.';
            }
          } else {
            this.errorMessage = 'Try Again';
          }
        }
      );
  }
  
  paymentType(paymentTypee: string) {
    if (paymentTypee == "cash") {
      this.paymentTypeChosen.set("cash");
    } else {
      this.paymentTypeChosen.set("credit");
    }
  }

}
