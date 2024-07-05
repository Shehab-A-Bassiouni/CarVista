import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CarToEdit, type Cars } from '../display-cars/display-cars.component';
import { Component, inject, signal, NgModule, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule, Router } from "@angular/router";
import { FormsModule, ReactiveFormsModule, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { OfferToEdit } from '../display-offers/display-offers.component';

export interface getOfferData {
  id: number,
  type: string,
  percent: number,
  expiration: string,
  creationDate: string,
  isAvailable: boolean,
  description:string,
  isActive: boolean,
  amount: number
}

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule, FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    HttpClientModule],
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  idFormControl = new FormControl('', [Validators.required]);
  typeFormControl = new FormControl('',[Validators.required]);
  percentFormControl = new FormControl('',[Validators.required]);
  expirationFormControl = new FormControl('',[Validators.required]);
  descriptionFormControl = new FormControl('',[Validators.required]);

  offerType: string = 'Percent';
  offerPercent: number = 0;
  offerExpiration: string = '';
  offerDescription: string = '';

  OfferForGet = signal<getOfferData>({
    id: 0,
    type: "",
    percent: 0,
    expiration: "",
    creationDate: "",
    description: "",
    isAvailable: true,
    isActive: true,
    amount: 0,
  });
  httpClient = inject(HttpClient);

  constructor(private router: Router ,private http: HttpClient, private _snackBar: MatSnackBar) {
    this.idFormControl.disable();
    this.getOfferById();
  }

  ngOnInit(): void {
  }

  formSubmitted() {
    if (this.isFormValid()) {
      this.uploadOfferDetails();
    } else {
      console.error('Form is invalid or file is not selected');
    }
  }

  isFormValid(): boolean {
    return this.typeFormControl.valid &&
    this.percentFormControl.valid &&
    this.expirationFormControl.valid &&
    this.descriptionFormControl.valid 
  }

  getOfferDetails() {
    console.log('test')
    return {
      id:this.idFormControl.value,
      type: this.typeFormControl.value,
      description: this.descriptionFormControl.value,
      percent: this.percentFormControl.value,
      expiration: this.expirationFormControl.value,
      amount:0,
      isAvailable:true,
      isActive: true
    };
  }
 
  setOfferDetailsFormControl(){
    this.idFormControl.setValue(this.OfferForGet().id.toString())
    this.typeFormControl.setValue(this.OfferForGet().type) ;
     this.percentFormControl.setValue(this.OfferForGet().percent.toString());
     this.expirationFormControl.setValue(this.OfferForGet().expiration);
     this.descriptionFormControl.setValue(this.OfferForGet().description);
  
  }

  uploadOfferDetails() {
    console.log('testput')
    let fullOfferDetail = this.getOfferDetails();
    // fullCarDetail.type = this.type;
      console.log(fullOfferDetail)
     this.httpClient.put('http://localhost:5210/api/Offer', fullOfferDetail).subscribe({
       next: (res: any) => {
         console.log(res);
         this.openSnackBar();
         this.router.navigate(['/Display/Offers']);
       },
       error: (err: any) => {
         console.error('Error occurred:', err);
       }
     });
   }

  getOfferById(): void {
    // Replace with your API endpoint to get offer details by ID
    this.http.get<any>(`http://localhost:5210/api/Offer/${OfferToEdit.id}`)
      .subscribe({
        next: (offer: any) => {
          console.log('Offer retrieved successfully:', offer);
          // Populate form fields with retrieved offer data
          this.OfferForGet.set(offer);
          this.setOfferDetailsFormControl();
        },
        error: (err: any) => {
          console.error('Error retrieving offer:', err);
        }
      })
  };

  openSnackBar() {
    this._snackBar.open('Offer Edited', 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }
}
