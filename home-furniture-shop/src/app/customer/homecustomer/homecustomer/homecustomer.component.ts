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
          category_name:
            this.categories.find(c => c.category_id === p.category_id)
              ?.category_name || 'N/A'
        }));

        this.totalPages = Math.ceil(this.products.length / this.productsPerPage);
        this.updatePaginatedProducts();
      });
    });
  }

  updatePaginatedProducts() {
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
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
    // Redirect to order page with product id as parameter
    this.router.navigate(['/ordercustomer/ordercustomer'], { queryParams: { product_id: product.product_id } });
  }
}
