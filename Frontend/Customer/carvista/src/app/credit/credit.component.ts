import { HttpClient,HttpHandler, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
declare const Stripe:any;
@Component({
  selector: 'app-credit',
  standalone: true,
  imports: [],
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.scss',
  providers:[HttpClient]
})

export class CreditComponent  implements OnInit {
  carId!: number;
  days!:number;
  constructor(private router: Router,private httpClient: HttpClient,private route: ActivatedRoute) {}

  createCheckoutSession(): Observable<any> {
    let params = new HttpParams()
    .set('carid', this.carId)
    .set('days', this.days);
    
    return this.httpClient.get<any>('http://localhost:5210/api/Payment' , {params:params});
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.carId = +params['carId'];
      this.days = +params['days']; 
    });
  }

  Checkout() {
    this.createCheckoutSession().subscribe(
      (response) => {
        const stripe = Stripe('pk_test_51OttOEBBRnVLSfz9fxhNZ1HJHHIkSjtEKszQM5CMeLgGF4lZguMH6UNmPTQ0Ns38Ab5iwgKUpctuCs5Z2keKuCBE00jaQcukAj'); // Replace with your Stripe publishable key
        stripe.redirectToCheckout({
          sessionId: response.sessionId
        }).then((result:any) => {
          if (result.error) {
            console.error(result.error.message);
          }
          else{
            this.router.navigate(['/Success']);
          }
         
        });
      },
      (error) => {
        console.error('Error creating checkout session', error);
      }
    );
  }


 
 
}
