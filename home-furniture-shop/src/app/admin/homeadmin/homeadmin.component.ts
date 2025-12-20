import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-homeadmin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './homeadmin.component.html',
  styleUrls: ['./homeadmin.component.css']
})
export class HomeadminComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: Category[] = [];

  selectedCategory: number = 0; // 0 = All

  // Pagination
  currentPage = 1;
  productsPerPage = 6;
  totalPages = 0;

  showAddProductModal = false;

  newProduct: Partial<Product> = {
    product_name: '',
    price: 0,
    description: '',
    category_id: 0,
    stock_quantity: 0
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // =============================
  // LOAD CATEGORIES THEN PRODUCTS
  // =============================
  loadCategories() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe(products => {
      // Add category_name for display
      this.products = products.map(p => ({
        ...p,
        category_name:
          this.categories.find(c => c.category_id === p.category_id)?.category_name || 'N/A'
      }));

      this.applyFilter(); // initialize filtered + paginated
    });
  }

  // =============================
  // FILTER BY CATEGORY
  // =============================
  applyFilter() {
    // Filter products
    this.filteredProducts = this.selectedCategory === 0
      ? [...this.products]
      : this.products.filter(p => p.category_id === this.selectedCategory);

    // Reset pagination
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;

    this.updatePaginatedProducts();
  }

  filterByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    this.currentPage = 1; // Reset to first page on category change
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
        <p><strong>Price:</strong> ₱${product.price}</p>
        <p><strong>Category:</strong> ${product.category_name}</p>
        <p><strong>Description:</strong> ${product.description || 'N/A'}</p>
        <p><strong>Stock:</strong> ${product.stock_quantity} || 'N/A'</p>
      `,
      showCloseButton: true,
      confirmButtonText: 'Close',
      width: 400
    });
  }

  // =============================
  // DELETE PRODUCT
  // =============================
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

            // Remove from products
            this.products = this.products.filter(p => p.product_id !== productId);

            this.applyFilter();
          },
          error: () => Swal.fire('Error', 'Failed to delete product', 'error')
        });
      }
    });
  }

  // =============================
  // ADD PRODUCT
  // =============================
  submitAddProduct() {
    if (!this.newProduct.product_name || !this.newProduct.price || !this.newProduct.category_id) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    const payload = {
      product_name: this.newProduct.product_name,
      price: this.newProduct.price,
      stock_quantity: this.newProduct.stock_quantity ?? 0,
      description: this.newProduct.description ?? '',
      category_id: this.newProduct.category_id
    };

    this.productService.create(payload).subscribe({
      next: (res: any) => {
        const createdProduct: Product = res.product;

        Swal.fire('Success', 'Product added successfully', 'success');

        this.products.push({
          ...createdProduct,
          category_name:
            this.categories.find(c => c.category_id === createdProduct.category_id)?.category_name || 'N/A'
        });

        this.applyFilter();

        // Reset form
        this.newProduct = {
          product_name: '',
          price: 0,
          stock_quantity: 0,
          description: '',
          category_id: 0
        };
        this.showAddProductModal = false;
      },
      error: (err) => {
        console.error('Add Product Error:', err);
        Swal.fire('Error', 'Failed to create product', 'error');
      }
    });
  }
}
