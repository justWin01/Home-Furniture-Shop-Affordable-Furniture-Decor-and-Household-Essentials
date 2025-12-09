import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { LoginComponent } from './pages/login/login.component';
import { HomecustomerComponent } from './customer/homecustomer/homecustomer/homecustomer.component';



// Customer Routes
export const customerRoutes: Routes = [
  { path: 'homecustomer', component: HomecustomerComponent,title: 'Home' }
];

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'contact', component: ContactComponent, title: 'Contact' },
  { path: 'shop', component: ShopComponent, title: 'Shop' },
  { path: 'login', component: LoginComponent, title: 'Login' },

  // Customer routes
  { path: 'customer', children: customerRoutes },

  { path: '**', redirectTo: '' }
];
