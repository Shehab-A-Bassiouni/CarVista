import { Component, ViewChild, ElementRef, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-offer',
  standalone: true,
  imports: [MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    RouterModule],
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss']
})


export class AddOfferComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  manfFormControl = new FormControl('', [Validators.required]);
  modelFormControl = new FormControl('', [Validators.required]);
  yearFormControl = new FormControl('', [Validators.required]);
  plateFormControl = new FormControl('', [Validators.required]);
  chassisFormControl = new FormControl('', [Validators.required]);
  colorFormControl = new FormControl('', [Validators.required]);
  fuelTypeFormControl = new FormControl('', [Validators.required]);
  fuelBarFormControl = new FormControl('', [Validators.required]);
  odoFormControl = new FormControl('', [Validators.required]);
  priceFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  offerType: string = '';
  offerPercent: number = 0;
  offerExpiration: string = '';
  offerDescription: string = '';
  
  
   
    constructor(private httpClient: HttpClient, private router: Router ,  private _snackBar: MatSnackBar) {
  }


  ngOnInit() {
  }

  formSubmitted() {
    if (this.isFormValid()) {
      this.addOffer();
    } else {
      console.error('Form is invalid');
    }
  }

  isFormValid(): boolean {
    return !!this.offerType && !!this.offerPercent && !!this.offerExpiration && !!this.offerDescription;
  }

  getOfferDetails() {
    return {
      type: this.offerType,
      percent: this.offerPercent,
      expiration: new Date(this.offerExpiration).toISOString(),
      creationDate: new Date().toISOString(),
      isAvailable: true,
      description: this.offerDescription,
      isActive: true,
      amount: 0
    };
  }



  addOffer() {
    const offerDetails = this.getOfferDetails();
    this.httpClient.post('http://localhost:5210/api/Offer', offerDetails).subscribe({
      next: (res: any) => {
        this.openSnackBar();
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
  }


  openSnackBar() {
    this._snackBar.open('Offer Added', 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

