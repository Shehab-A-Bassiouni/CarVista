import { Component, signal, ElementRef, ViewChild, AfterViewInit, inject} from '@angular/core';
import {carToRent , type Cars} from '../display-cars/display-cars.component';
import { Routes ,RouterLink, Router } from '@angular/router';

export let carRented = {};

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rent.component.html',
  styleUrl: './rent.component.scss'
})
export class RentComponent {
@ViewChild('days') days!: ElementRef<HTMLInputElement>;
  router = inject(Router)
   car:Cars ;

  totalCost = signal<number>(0);

constructor(){
  this.car = carToRent;
}

CalcCost(){
  this.totalCost.set(Number(this.days.nativeElement.value) * this.car.pricePerDay);
  carRented = {
    carId: this.car.id,
    days : Number(this.days.nativeElement.value),
    totalCost: this.totalCost
  }
}

}
