import { Routes ,RouterLink } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DisplayCarsComponent } from './display-cars/display-cars.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from '../app/register/register.component';
import { ConfirmEmailComponent } from '../app/confirm-email/confirm-email.component';
import { RentComponent } from './rent/rent.component';
import { RentCarComponent } from './rent-car/rent-car.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CashComponent } from './cash/cash.component';
import { CreditComponent } from './credit/credit.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SuccessComponent } from './success/success.component';
import { FailedComponent } from './failed/failed.component';
import { PastRentsComponent } from './past-rents/past-rents.component';
import {CarDetailsComponent} from "./car-details/car-details.component"


export const routes: Routes = [
    {path:"", component:HomeComponent},
    {path:"Display/Cars", component:DisplayCarsComponent},
    {path: 'rent/:carId', component: RentCarComponent },
    {path:"Display/Wishlist", component:WishlistComponent},
    {path:"Login", component:LoginComponent},
    {path:"Register", component:RegisterComponent},
    {path:"ConfirmEmail", component: ConfirmEmailComponent },
    {path:"Rent", component:RentComponent},
    {path:"Cash", component:CashComponent},
    {path:"Credit", component:CreditComponent},
    {path:"ForgetPassword", component:ForgetPasswordComponent},
    {path:"ResetPassword", component:ResetPasswordComponent},
    {path:"PastRents", component:PastRentsComponent},
    {path:"Success", component:SuccessComponent},
    {path:"Failed", component:FailedComponent},
    {path:"Details", component:CarDetailsComponent},
    {path:"Cash", component:CashComponent}



];
