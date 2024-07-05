import {ChangeDetectionStrategy, Component, inject ,input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import {CarIDToDelete} from "../display-cars.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [HttpClientModule,MatButtonModule ,MatDialogActions,MatDialogContent ,MatDialogClose  , MatDialogTitle  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteDialogComponent>);
  httpClient = inject(HttpClient);

  deleteCarById(){
    this.httpClient.delete('http://localhost:5210/api/Car/'+CarIDToDelete)
    .subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err) => console.error(err)
    });
    this.dialogRef.close(true);
  }
  
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}

