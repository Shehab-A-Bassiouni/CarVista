import { RouterModule ,Router ,RouterOutlet ,RouterLink } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy , ChangeDetectionStrategy , signal ,computed} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from '../app/loading-screen/loading-screen.component';
import { LoadingService } from '../app/loading-screen/loading.service';
import { LoginComponent } from "./login/login.component";
import { WishlistComponent } from "./wishlist/wishlist.component";
import { RegisterComponent } from "./register/register.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import {MatMenuModule} from '@angular/material/menu';
import { GlobalsService } from "./globals.service";
import { environment } from '../environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgxStripeModule } from 'ngx-stripe';
import { SuccessComponent } from "./success/success.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject } from '@angular/core';
export let offerToView: Offers;


let loggedOneTime = false;

export interface Offers {
    id: number,
    type: string,
    percent: number,
    expiration: string,
    description: string,
    isActive: boolean,
    amount: number,
    creationDate: string,
    isAvailable: boolean
}

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatMenuModule,RegisterComponent,SuccessComponent, CommonModule, RouterLink, RouterModule, RouterOutlet, MatExpansionModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, LoadingScreenComponent, LoginComponent, WishlistComponent, NgxStripeModule, HttpClientModule, ForgetPasswordComponent, ResetPasswordComponent]
})

export class AppComponent {


    loggedIn = signal<boolean>(false);
    

    registerClicked = signal<boolean>(false);
    httpClient = inject(HttpClient);
    sideNav_displayCars = false;

  public offer = signal<Offers | null>(null); 
  public offerAmount = signal<number | null>(null); 

  title = 'carvista';
  mobileQuery: MediaQueryList;
  readonly panelOpenState = signal(false);

  isLoading = signal(this.loadingService.loading$);

  private _mobileQueryListener: () => void;

  constructor(public globals: GlobalsService,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher , private loadingService: LoadingService , private router:Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.getLastActiveOffer();
  }

  goToLogin(){
    this.router.navigate(['./Login']);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

    getLastActiveOffer() {
        this.httpClient.get<Offers>('http://localhost:5210/api/Offer/last-active')
            .subscribe({
                next: (data: Offers) => {
                    this.offer.set(data);
                    this.offerAmount.set(data.percent);
                },
                error: (err) => console.error('Error fetching offer:', err)
            });
    }

    loginSuccess(){
      this.loggedIn.set(true);
    }
}
