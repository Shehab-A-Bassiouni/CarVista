import { RouterModule ,Router ,RouterOutlet ,RouterLink } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy , ChangeDetectionStrategy , signal ,computed} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import { LoginComponent } from "../app/login/login.component";
import { RegisterComponent } from "../app/register/register.component";
import { DisplayCarsComponent } from '../app/display-cars/display-cars.component';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from '../app/loading-screen/loading-screen.component';
import { LoadingService } from '../app/loading-screen/loading.service';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink, RouterModule, RouterOutlet, DisplayCarsComponent, MatExpansionModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, LoginComponent, LoadingScreenComponent]
})

export class AppComponent {

  sideNav_displayCars = false;

  title = 'carvista';
  mobileQuery: MediaQueryList;
  readonly panelOpenState = signal(false);

  isLoading = signal(this.loadingService.loading$);


  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher , private loadingService: LoadingService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }



}
