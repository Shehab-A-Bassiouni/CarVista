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
import {manfToEdit , type Manfs} from '../display-manufactures/display-manufactures.component'

@Component({
  selector: 'app-edit-manufacture',
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
  templateUrl: './edit-manufacture.component.html',
  styleUrl: './edit-manufacture.component.scss'
})
export class EditManufactureComponent  {

  manf:Manfs = {
    id: 0,
    name:"",
    description: "",
    logo:""
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  idFormControl = new FormControl(0, [Validators.required]);
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  uniqName! : string;
  imageSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  fileError: string | null = null;

  constructor(private httpClient:HttpClient,private router: Router ,  private _snackBar: MatSnackBar){
    this.manf = manfToEdit;   
    this.setManfDetails();
    this.idFormControl.disable();
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


  uploadImage(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.httpClient.post('http://localhost:5210/api/Manufacturer/Upload', formData)
      .subscribe({
        next: (res: any) => {
        this.uniqName = res.fileName;
      this.uploadManfDetails();
        },
        error: (err: any) => {
          console.error('Error occurred:', err);
        }
      });
  }
}

  formSubmitted() {
    if (this.isFormValid()) {
      this.uploadImage();
    } else {
      console.error('Form is invalid or file is not selected');
    }
  }

  getManfDetails() {
    return {
      id:this.idFormControl.value,
      name:this.nameFormControl.value,
      description:this.descFormControl.value,
      logo:manfToEdit.logo
    };
  }

  isFormValid(): boolean {
    return this.descFormControl.valid &&
      this.nameFormControl.valid
  }

  setManfDetails(){
    this.idFormControl.setValue(manfToEdit.id);
    this.nameFormControl.setValue(manfToEdit.name);
    this.descFormControl.setValue(manfToEdit.description);
  }

  openSnackBar() {
    this._snackBar.open('Manufacturer Edited', 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }

  uploadManfDetails() {
    let fullManfDetail = this.getManfDetails();
    if(this.uniqName) fullManfDetail.logo = this.uniqName;
     this.httpClient.put('http://localhost:5210/api/Manufacturers/'+fullManfDetail.id, fullManfDetail).subscribe({
       next: (res: any) => {
         console.log(res);
         this.openSnackBar();
         this.router.navigate(['/Display/Manufactures']);
       },
       error: (err: any) => {
         console.error('Error occurred:', err);
       }
     });
   }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}