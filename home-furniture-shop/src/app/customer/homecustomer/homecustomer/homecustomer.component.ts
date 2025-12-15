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
  paginatedProducts: Product[] = [];
  categories: Category[] = [];

  selectedCategory: number = 0; // 0 = All categories

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
    this.loadProducts();
  }

  loadProducts() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;

      this.productService.getAll().subscribe(products => {
        this.products = products.map(p => ({
          ...p,
          category_name: this.categories.find(c => c.category_id === p.category_id)?.category_name || 'N/A',
          stock_quantity: p.stock_quantity ?? 0 // fallback to 0 if undefined
        }));

        this.applyFilter();
      });
    });
  }

  applyFilter() {
    let filteredProducts = this.products;

    if (this.selectedCategory !== 0) {
      filteredProducts = this.products.filter(p => p.category_id === this.selectedCategory);
    }

    this.totalPages = Math.ceil(filteredProducts.length / this.productsPerPage);
    this.currentPage = 1;
    this.updatePaginatedProducts(filteredProducts);
  }

  updatePaginatedProducts(filteredProducts?: Product[]) {
    const list = filteredProducts || this.products;
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.paginatedProducts = list.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilter();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilter();
    }
  }

  filterByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    this.applyFilter();
  }

  viewProductModal(product: Product) {
    Swal.fire({
      title: `<strong>${product.product_name}</strong>`,
      html: `
        <img src="http://localhost:5000/static/uploads/products/${product.image || ''}"
             style="width:250px; height:250px; object-fit:cover; margin-bottom:10px;" />
        <p style="font-weight:bold; color:#0077b6;">₱${product.price}</p>
        <p>Category: ${product.category_name}</p>
        <p>Description: ${product.description || 'N/A'}</p>
        <p>Remaining Stock: ${product.stock_quantity}</p>
      `,
      showCloseButton: true,
      confirmButtonText: 'Close',
      width: 400
    });
  }

  orderProduct(product: Product) {
    if (!product.stock_quantity || product.stock_quantity <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Out of Stock',
        text: 'This product is no longer available.'
      });
      return;
    }

    // Redirect to order page with product id and quantity = 1
    this.router.navigate(['/ordercustomer/ordercustomer'], {
      queryParams: { product_id: product.product_id, quantity: 1 }
    });

    // Reduce the stock locally
    product.stock_quantity!--;
  }
}
