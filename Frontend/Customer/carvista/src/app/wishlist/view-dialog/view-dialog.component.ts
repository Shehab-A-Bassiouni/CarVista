import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-view-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './view-dialog.component.html',
  styleUrl: './view-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewDialogComponent {
}
