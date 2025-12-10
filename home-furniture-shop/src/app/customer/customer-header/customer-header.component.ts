import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive ],
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.css']
})
export class CustomerHeaderComponent implements OnInit {

  menuActive: boolean = false;
  profileModal: boolean = false;

  user: User = { fullname: '', email: '', address: '' };

  constructor(private router: Router) {}

  ngOnInit() {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString); // now has fullname and address
    }
  }


  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  toggleProfileModal() {
    this.profileModal = !this.profileModal;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
