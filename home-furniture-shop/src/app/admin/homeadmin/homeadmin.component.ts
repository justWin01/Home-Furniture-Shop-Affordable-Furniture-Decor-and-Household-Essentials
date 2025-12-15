import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-homeadmin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homeadmin.component.html',
  styleUrls: ['./homeadmin.component.css']
})
export class HomeadminComponent implements OnInit {

  products: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: Category[] = [];

  // Pagination
  currentPage = 1;
  productsPerPage = 6;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
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
        <p style="font-weight:bold;">₱${product.price}</p>
        <p>Category: ${product.category_name}</p>
        <p>Description: ${product.description || 'N/A'}</p>
        <p>Stock: ${product.stock_quantity}</p>
      `,
      showCloseButton: true,
      confirmButtonText: 'Close',
      width: 400
    });
  }
  deleteProduct(productId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it'
    }).then(result => {
      if (result.isConfirmed) {
        this.productService.delete(productId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');

            // Remove product locally
            this.products = this.products.filter(p => p.product_id !== productId);

            this.totalPages = Math.ceil(this.products.length / this.productsPerPage);

            // Fix page overflow
            if (this.currentPage > this.totalPages && this.totalPages > 0) {
              this.currentPage = this.totalPages;
            }

            this.updatePaginatedProducts();
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete product.', 'error');
          }
        });
      }
    });
  }
}
