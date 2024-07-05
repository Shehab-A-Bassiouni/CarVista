import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-failed',
  standalone: true,
  imports: [MatButtonModule,RouterLink],
  templateUrl: './failed.component.html',
  styleUrl: './failed.component.scss'
})
export class FailedComponent {

}
