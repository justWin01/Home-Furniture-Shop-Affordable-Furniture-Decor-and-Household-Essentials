import { Routes } from '@angular/router';

// Main pages
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { LoginComponent } from './pages/login/login.component';

// Customer pages
import { HomecustomerComponent } from './customer/homecustomer/homecustomer/homecustomer.component';
import { OrdercustomerComponent } from './customer/ordercustomer/ordercustomer/ordercustomer.component';

// Admin pages
import { HomeadminComponent } from './admin/homeadmin/homeadmin.component';



// ----------------------
// CUSTOMER ROUTES
// ----------------------
export const customerRoutes: Routes = [
  { path: 'homecustomer', component: HomecustomerComponent, title: ' Home' },
  { path: 'ordercustomer', component: OrdercustomerComponent, title: ' Orders' }
];

// ----------------------
// ADMIN ROUTES
// ----------------------
export const adminRoutes: Routes = [
  { path: 'homeadmin', component: HomeadminComponent, title: ' Home' },
];

// ----------------------
// APP ROUTES
// ----------------------
export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'contact', component: ContactComponent, title: 'Contact' },
  { path: 'shop', component: ShopComponent, title: 'Shop' },
  { path: 'login', component: LoginComponent, title: 'Login' },

  // Customer Route Parent
  { path: 'customer', children: customerRoutes },

  // Admin Route Parent
  { path: 'admin', children: adminRoutes },

  // Default redirect
  { path: '**', redirectTo: 'customer/homecustomer' }
];
