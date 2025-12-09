import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/landingpage/header.component';
import { CustomerHeaderComponent } from './customer/customer-header/customer-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, CustomerHeaderComponent],
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
    // Landing pages (home, about, shop, contact, login)
    else {
      this.currentHeader = 'landing';
    }
  }
}
