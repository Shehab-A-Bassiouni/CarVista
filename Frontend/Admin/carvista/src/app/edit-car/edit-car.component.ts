import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CarToEdit, type Cars } from '../display-cars/display-cars.component';
import { Component, inject, signal, NgModule,ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from "@angular/router";
import { FormsModule, ReactiveFormsModule, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

export interface MANFS {
  id: number;
  name: string;
  logo: string;
  description: string;
  carIds: number[];
}

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

export interface putCarData {
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
  image:string;
  manufacturerId: number;
  isActive:boolean;
}

@Component({
  selector: 'app-edit-car',
  standalone: true,
  imports: [HttpClientModule, FormsModule ,CommonModule, FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    MatSelectModule, 
    MatButtonModule, 
    CommonModule, 
    RouterModule, 
    HttpClientModule],

  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.scss']
})
export class EditCarComponent {
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  idFormControl = new FormControl('', [Validators.required]);
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
  imageSrc: string | ArrayBuffer | null = null;
  uniqName! : string;

  CarForGet = signal<getCarData>({
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

  manfList = signal<MANFS[]>([]);
  httpClient = inject(HttpClient);
  selectedValue?:number;
  constructor(private router: Router ,  private _snackBar: MatSnackBar) {
    this.idFormControl.disable();
    this.getManf();
    this.getCar();
  }

  formSubmitted() {
    if (this.isFormValid()) {
      this.uploadCarDetails();
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
      this.descFormControl.valid 
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
     this.selectedValue! = Number(selectElement.value);
    console.log('Selected value:', this.selectedValue);
  }

  getCarDetails() {
    let tempManf!:number;

    if(this.selectedValue) tempManf = this.selectedValue;
    else tempManf = this.manfList().find(x=>x.name == this.CarForGet().manufacturer)!.id;
    console.log(5555555555555555555555555555555)
    console.log(tempManf)
    return {
      id:this.idFormControl.value,
      manufacturerId: tempManf,
      model: this.modelFormControl.value,
      yearModel: this.yearFormControl.value,
      color: this.colorFormControl.value,
      fuelType: this.fuelTypeFormControl.value,
      fuelBar: this.fuelBarFormControl.value,
      PlateNumber: this.plateFormControl.value,
      ChassisNumber: this.chassisFormControl.value,
      odometer: this.odoFormControl.value,
      pricePerDay: this.priceFormControl.value,
      description: this.descFormControl.value,
      image: this.selectedFile?.name??"",
      isActive: true
    };
  }

  setCarDetailsFromControl(){
    this.idFormControl.setValue(this.CarForGet().id.toString())
    this.manfFormControl.setValue(this.CarForGet().manufacturer) ;
     this.modelFormControl.setValue(this.CarForGet().model);
   this.yearFormControl.setValue(this.CarForGet().yearModel.toString());
  this.colorFormControl.setValue(this.CarForGet().color);
    this.fuelTypeFormControl.setValue(this.CarForGet().fuelType);
    this.fuelBarFormControl.setValue(this.CarForGet().fuelBar.toString());
     this.plateFormControl.setValue(this.CarForGet().plateNumber);
    this.chassisFormControl.setValue(this.CarForGet().chassisNumber);
  this.odoFormControl.setValue(this.CarForGet().odometer.toString());
     this.priceFormControl.setValue(this.CarForGet().pricePerDay.toString());
    this.descFormControl.setValue(this.CarForGet().description);
  }


  uploadCarDetails() {
    console.log(11111111111111111111)
    let fullCarDetail = this.getCarDetails();
    if(!this.uniqName) fullCarDetail.image = "to edit";
    else fullCarDetail.image = this.uniqName;
      console.log(fullCarDetail)
     this.httpClient.put('http://localhost:5210/api/Car', fullCarDetail).subscribe({
       next: (res: any) => {
         console.log(res);
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

  getCar() {
    this.httpClient.get<getCarData>('http://localhost:5210/api/Car/' + CarToEdit.id).subscribe({
      next: (res: getCarData) => {
        console.log(res);
        this.CarForGet.set(res);
        this.setCarDetailsFromControl();
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
      this.uploadImage()
    }
  }


  uploadImage(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.httpClient.post('http://localhost:5210/api/Car/Upload', formData)
      .subscribe({
        next: (res: any) => {
        this.uniqName = res.fileName;
         console.log(res);
        },
        error: (err: any) => {
          console.error('Error occurred:', err);
        }
      });
  }
}

  openSnackBar() {
    this._snackBar.open('Car Edited', 'Ok', {
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