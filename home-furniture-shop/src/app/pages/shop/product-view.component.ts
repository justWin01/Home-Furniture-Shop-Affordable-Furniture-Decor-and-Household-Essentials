import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'; // <-- import SweetAlert2
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  product!: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe(res => {
      this.product = res;
    });
  }

  orderProduct() {
    const isLoggedIn = localStorage.getItem('token');

    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'You must log in or sign up first!',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#0077b6'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    // If logged in, show SweetAlert for order confirmation
    Swal.fire({
      icon: 'success',
      title: 'Order Placed!',
      text: `Order placed for ${this.product.product_name}`,
      timer: 2000,
      showConfirmButton: false
    });
  }
}
