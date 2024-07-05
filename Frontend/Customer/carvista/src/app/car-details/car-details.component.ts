import { Component, inject , OnInit, signal } from '@angular/core';
import {carToView , Cars} from "../display-cars/display-cars.component"
import { HttpClient } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  CarouselComponent,
  CarouselControlComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  CarouselIndicatorsComponent,
  ThemeDirective
} from '@coreui/angular';



export interface getCarData {
  id: number;
  model: string;
  plateNumber: string;
  chassisNumber: string;
  color: string;
  description: string;
  yearModel: number;
  fuelType: string;
  pricePerDay: number;
  odometer: number;
  fuelBar: number;
  manufacturer: string;
  image:string;
}

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CarouselIndicatorsComponent,ThemeDirective, CarouselComponent, CarouselInnerComponent, NgFor, CarouselItemComponent, CarouselControlComponent, RouterLink],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.scss'
})
export class CarDetailsComponent implements OnInit {
  car = signal<getCarData>({
    id: 0,
    model: "",
    plateNumber: "",
    chassisNumber: "",
    color: "",
    description: "",
    yearModel: 0,
    fuelType: "",
    pricePerDay: 0,
    odometer: 0,
    fuelBar: 0,
    manufacturer: "",
    image:""
  });

  constructor(){
    this.car().id = carToView.id;
    this.getCar();
    this.getReviews();
  }
  httpClient = inject(HttpClient);

  getCar() {
    this.httpClient.get<getCarData>('http://localhost:5210/api/Car/' + this.car().id).subscribe({
      next: (res: getCarData) => {
        this.car.set(res);
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
  }


  result = signal<any>({});

  getReviews(){
    this.httpClient.get<any>('http://localhost:5210/api/Review/Car/' + carToView.id).subscribe({
      next: (res: getCarData) => {
        this.result.set(res) ;
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
  }

  ngOnInit(): void {

   
  }
}