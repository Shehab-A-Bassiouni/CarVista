import { RouterModule ,Router ,RouterOutlet ,RouterLink } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy , ChangeDetectionStrategy , signal ,computed} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import { LoginComponent } from "./login/login.component";
import { DisplayCarsComponent } from './display-cars/display-cars.component';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from '../app/loading-screen/loading-screen.component';
import { LoadingService } from '../app/loading-screen/loading.service';
import {MatMenuModule} from '@angular/material/menu';
import {DisplayOffersComponent} from '../app/display-offers/display-offers.component';
import {DisplayUsersComponent} from '../app/display-users/display-users.component';



@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatMenuModule,CommonModule, RouterLink, RouterModule, RouterOutlet, DisplayCarsComponent, MatExpansionModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, LoginComponent, LoadingScreenComponent,DisplayOffersComponent,DisplayUsersComponent]
})

export class AppComponent {

  loggedIn = signal<boolean>(false);

  sideNav_displayCars = false;

  title = 'carvista';
  mobileQuery: MediaQueryList;
  readonly panelOpenState = signal(false);

  isLoading = signal(this.loadingService.loading$);


  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher , private loadingService: LoadingService , private router:Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  goToLogin():void
  {
    this.router.navigate(["Login"]);
  }


  loginSuccess(){
    this.loggedIn.set(true);
  }

}
