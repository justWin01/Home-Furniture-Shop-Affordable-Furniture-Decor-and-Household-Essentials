import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: Category[] = [];

  // Pagination
  currentPage = 1;
  productsPerPage = 6; // 2 rows * 3 columns
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;

      this.productService.getAll().subscribe(products => {
        this.products = products.map(p => ({
          ...p,
          category_name: this.categories.find(c => c.category_id === p.category_id)?.category_name
        }));

        this.totalPages = Math.ceil(this.products.length / this.productsPerPage);
        this.updatePaginatedProducts();
      });
    });
  }

  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  viewProductModal(product: Product) {
    Swal.fire({
      title: `<strong>${product.product_name}</strong>`,
      html: `
        <img src="http://localhost:5000/static/uploads/products/${product.image || ''}"
             style="width:250px; height:250px; object-fit:cover; margin-bottom:10px;" />
        <p style="font-weight:bold; color:#0077b6;">₱${product.price}</p>
        <p>Category: ${product.category_name || 'N/A'}</p>
        <p>Description: ${product.description || 'N/A'}</p>
        <p>Stock Quantity: ${product.stock_quantity}</p>
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
