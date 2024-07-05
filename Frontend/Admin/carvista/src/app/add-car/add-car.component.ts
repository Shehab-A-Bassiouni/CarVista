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

export interface MANFS {
  id: number;
  name: string;
  logo: string;
  description: string;
  carIds: number[];
}

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit {
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


  selectedFile: File | null = null;
  fileError: string | null = null;
  addedCarId:number = 0;
  manfList = signal<MANFS[]>([]);
  imageSrc: string | ArrayBuffer | null = null;
  uniqName! : string;
   
    constructor(private httpClient: HttpClient, private router: Router ,  private _snackBar: MatSnackBar) {
    this.getManf();
  }

  ngOnInit() {
    this.getManf();
  }

  formSubmitted() {
    if (this.isFormValid()) {
      this.uploadImage();
    } else {
      console.error('Form is invalid or file is not selected');
    }
  }

  isFormValid(): boolean {
    return this.manfFormControl.valid &&
      this.modelFormControl.valid &&
      this.yearFormControl.valid &&
      this.plateFormControl.valid &&
      this.chassisFormControl.valid &&
      this.colorFormControl.valid &&
      this.fuelTypeFormControl.valid &&
      this.fuelBarFormControl.valid &&
      this.odoFormControl.valid &&
      this.priceFormControl.valid &&
      this.descFormControl.valid &&
      this.selectedFile !== null;
  }

  getCarDetails() {
    return {
      ManufacturerId: this.manfFormControl.value,
      Model: this.modelFormControl.value,
      YearModel: this.yearFormControl.value,
      Color: this.colorFormControl.value,
      FuelType: this.fuelTypeFormControl.value,
      FuelBar: this.fuelBarFormControl.value,
      PlateNumber: this.plateFormControl.value,
      ChassisNumber: this.chassisFormControl.value,
      Odometer: this.odoFormControl.value,
      PricePerDay: this.priceFormControl.value,
      Description: this.descFormControl.value,
      Image: this.selectedFile?.name,
      isActive: true
    };
  }

  uploadImage(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.httpClient.post('http://localhost:5210/api/Car/Upload', formData)
      .subscribe({
        next: (res: any) => {
        this.uniqName = res.fileName;
        this.uploadCarDetails();
         console.log(res);
        },
        error: (err: any) => {
          console.error('Error occurred:', err);
        }
      });
  }
}

  uploadCarDetails() {
   let fullCarDetail = this.getCarDetails();
   fullCarDetail.Image = this.uniqName;
    this.httpClient.post('http://localhost:5210/api/Car', fullCarDetail).subscribe({
      next: (res: any) => {
        this.openSnackBar();
        this.router.navigate(['/Display/Cars']);
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
  }

  getManf() {
    this.httpClient.get<MANFS[]>('http://localhost:5210/api/Manufacturers').subscribe({
      next: (res: MANFS[]) => {
        console.log(res);
        this.manfList.set(res);
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageSrc = reader.result;
      };

      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
      };

      reader.readAsDataURL(this.selectedFile); // Read the file as a data URL
    }
  }

  openSnackBar() {
    this._snackBar.open('Car Added', 'Ok', {
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
