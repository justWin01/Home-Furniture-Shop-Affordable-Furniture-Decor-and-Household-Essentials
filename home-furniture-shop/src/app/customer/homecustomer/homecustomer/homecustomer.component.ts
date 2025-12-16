import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-homecustomer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homecustomer.component.html',
  styleUrls: ['./homecustomer.component.css']
})
export class HomecustomerComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: Category[] = [];

  selectedCategory: number = 0; // 0 = All

  // Pagination
  currentPage = 1;
  productsPerPage = 6;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe(products => {
      this.products = products.map(p => ({
        ...p,
        category_name:
          this.categories.find(c => c.category_id === p.category_id)?.category_name || 'N/A'
      }));

      this.applyFilter(); // initialize filtered + paginated
    });
  }

  // =============================
  // FILTER
  // =============================
  applyFilter() {
    this.filteredProducts = this.selectedCategory === 0
      ? [...this.products]
      : this.products.filter(p => p.category_id === this.selectedCategory);

    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;

    this.updatePaginatedProducts();
  }

  filterByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    this.currentPage = 1; // reset page when filter changes
    this.applyFilter();
  }

  // =============================
  // PAGINATION
  // =============================
  updatePaginatedProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
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

  // =============================
  // VIEW PRODUCT
  // =============================
  viewProductModal(product: Product) {
    Swal.fire({
      title: `<strong>${product.product_name}</strong>`,
      html: `
        <img src="http://localhost:5000/static/uploads/products/${product.image || ''}"
             style="width:250px; height:250px; object-fit:cover; margin-bottom:10px;" />
        <p style="font-weight:bold; color:#0077b6;">₱${product.price}</p>
        <p>Category: ${product.category_name}</p>
        <p>Description: ${product.description || 'N/A'}</p>
        <p>Stock Quantity: ${product.stock_quantity}</p>
      `,
      showCloseButton: true,
      confirmButtonText: 'Close',
      width: 400
    });
  }

  orderProduct(product: Product) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user || !user.user_id) {
      Swal.fire({
        icon: 'warning',
        title: 'You must log in first!',
        text: 'Please log in to place an order.',
        confirmButtonText: 'Close'
      });
      return;
    }

    const quantity = 1;

    Swal.fire({
      icon: 'success',
      title: 'Order Placed!',
      html: `<p>You have successfully ordered <strong>${product.product_name}</strong>.</p>
             <p>Quantity: ${quantity}</p>`,
      showConfirmButton: true,
      confirmButtonText: 'Go to My Orders'
    }).then(() => {
      this.router.navigate(['customer/ordercustomer'], {
        queryParams: {
          product_id: product.product_id,
          quantity,
          customer_id: user.user_id
        }
      });
    });
  }
}
