import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/landingpage/header.component';
import { CustomerHeaderComponent } from './customer/customer-header/customer-header.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, CustomerHeaderComponent, AdminHeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currentHeader: string = 'landing';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.updateHeader();
    });
  }

  updateHeader() {
    const url = this.router.url;

    // Customer pages
    if (url.startsWith('/customer')) {
      this.currentHeader = 'customer';
    }
    // Admin pages
    else if (url.startsWith('/admin')) {
      this.currentHeader = 'admin';
    }
    // Landing pages (home, about, shop, contact, login)
    else {
      this.currentHeader = 'landing';
    }
  }
}
