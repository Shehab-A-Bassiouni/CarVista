import { Routes } from '@angular/router';
import {AddCarComponent} from './add-car/add-car.component'
import { DisplayCarsComponent } from './display-cars/display-cars.component';
import { EditCarComponent } from './edit-car/edit-car.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DisplayManufacturesComponent } from './display-manufactures/display-manufactures.component';
import { AddManufactureComponent } from './add-manufacture/add-manufacture.component';
import { EditManufactureComponent } from './edit-manufacture/edit-manufacture.component';
import { LoginComponent } from './login/login.component';
import { DisplayOffersComponent } from './display-offers/display-offers.component';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { EditOfferComponent } from './edit-offer/edit-offer.component';
import { DisplayUsersComponent } from './display-users/display-users.component';
import { DisplayBookingsComponent } from './display-bookings/display-bookings.component';
import { ChatComponent } from './chat/chat.component';

import { CarDetailsComponent } from './car-details/car-details.component';
export const routes: Routes = [
    {path:'Add/Car' , component:AddCarComponent},
    {path:'Display/Cars' , component:DisplayCarsComponent},
    {path:'Edit/Car' , component:EditCarComponent},
    {path:'' , component:HomeComponent},
    {path:'Display/Manufactures' , component:DisplayManufacturesComponent},
    {path:'Add/Manufacture' , component:AddManufactureComponent},
    { path: 'Edit/Manufacture', component: EditManufactureComponent },
    { path: 'Login', component: LoginComponent },
    { path: 'Display/Cars/Details', component: CarDetailsComponent },
    { path: 'Login', component: LoginComponent },
    { path: 'Display/Offers', component: DisplayOffersComponent },
    { path: 'Add/Offer', component: AddOfferComponent },
    { path: 'Edit/Offer', component: EditOfferComponent },
    { path: 'Display/Users', component: DisplayUsersComponent },
    {path:'Display/Bookings', component: DisplayBookingsComponent },
    {path: 'Display/Cars/Details/:carId', component: CarDetailsComponent},
    {path:'Chat/:receiverId/:username' , component:ChatComponent}

];
