import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // <-- import SweetAlert2

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchQuery: string = '';

  constructor(private router: Router) {}

  searchProducts() {
    if (this.searchQuery.trim()) {
      // Navigate to shop with query params
      this.router.navigate(['/shop'], { queryParams: { q: this.searchQuery } });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Please enter a product name to search.',
        confirmButtonColor: '#0077b6'
      });
    }
  }
}
