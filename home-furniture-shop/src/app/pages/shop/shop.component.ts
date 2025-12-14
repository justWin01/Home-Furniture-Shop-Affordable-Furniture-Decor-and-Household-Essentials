import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe(res => {
      this.products = res;
    });
  }

  // Show modal with product details
  viewProductModal(product: Product) {
    Swal.fire({
      title: `<strong>${product.product_name}</strong>`,
      html: `
        <img src="http://localhost:5000/static/uploads/products/${product.image || ''}"
             style="width:250px; height:250px; object-fit:cover; margin-bottom:10px;" />
        <p style="font-weight:bold; color:#0077b6;">₱${product.price}</p>
        <p><strong>Category:</strong> ${product.category?.category_name || 'N/A'}</p>
        <p>${product.description || ''}</p>
      `,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Order Now',
      cancelButtonText: 'Close',
      confirmButtonColor: '#28a745',
      width: 400
    }).then(result => {
      if (result.isConfirmed) this.orderProduct(product);
    });
  }

  // Place order with login check
  orderProduct(product: Product) {
    const isLoggedIn = localStorage.getItem('token');

    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'You must log in or sign up first!',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#0077b6'
      }).then(res => {
        if (res.isConfirmed) this.router.navigate(['/login']);
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Order Placed!',
      text: `Order placed for ${product.product_name}`,
      timer: 2000,
      showConfirmButton: false
    });
  }
}
