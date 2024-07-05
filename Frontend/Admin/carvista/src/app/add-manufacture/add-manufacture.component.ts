import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from "@angular/router";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-manufacture',
  standalone: true,
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    MatSelectModule, 
    MatButtonModule, 
    CommonModule, 
    RouterModule, 
    HttpClientModule
  ],
  templateUrl: './add-manufacture.component.html',
  styleUrls: ['./add-manufacture.component.scss']
})
export class AddManufactureComponent implements OnInit, AfterViewInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  @ViewChild('name') name!: ElementRef;
  @ViewChild('desc') desc!: ElementRef;
  @ViewChild('logo') logo!: ElementRef;

  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  selectedFile: File | null = null;
  fileError: string | null = null;

  constructor(
    private httpClient: HttpClient, 
    private _snackBar: MatSnackBar, 
    private router: Router
  ) {}

  uniqName! : string;
  imageSrc: string | ArrayBuffer | null = null;


  uploadImage(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.httpClient.post('http://localhost:5210/api/Manufacturer/Upload', formData)
      .subscribe({
        next: (res: any) => {
        this.uniqName = res.fileName;
        this.uploadManfDetails()
        },
        error: (err: any) => {
          console.error('Error occurred:', err);
        }
      });
  }
}

  isFormValid(): boolean {
    return this.nameFormControl.valid &&
      this.descFormControl.valid &&
      this.selectedFile !== null;
  }

  ngOnInit() {}

  ngAfterViewInit() {}

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


  uploadManfDetails(){
      const formData = new FormData();
      formData.append('name', this.name.nativeElement.value);
      formData.append('description', this.desc.nativeElement.value);
      formData.append('logo', this.uniqName);

      let dataToSend = {
        name:formData.get('name'),
        description: formData.get('description'),
        logo:formData.get('logo')!.toString()
      }
      
      this.httpClient.post('http://localhost:5210/api/Manufacturers', dataToSend).subscribe({
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


  formSubmitted() {
    if (this.isFormValid()) {
      this.uploadImage();
    }
  }


  openSnackBar() {
    this._snackBar.open('Manufacturer Added', 'Ok', {
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
