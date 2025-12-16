import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-homeadmin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './homeadmin.component.html',
  styleUrls: ['./homeadmin.component.css']
})
export class HomeadminComponent implements OnInit {

  products: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: Category[] = [];

  currentPage = 1;
  productsPerPage = 6;
  totalPages = 0;

  showAddProductModal = false;

  // Partial<Product> allows optional product_id
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
    this.loadProducts();
  }

  loadProducts() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
      this.productService.getAll().subscribe(products => {
        this.products = products.map(p => ({
          ...p,
          category_name: this.categories.find(c => c.category_id === p.category_id)?.category_name || 'N/A'
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
        <p><strong>Price:</strong> ₱${product.price}</p>
        <p><strong>Category:</strong> ${product.category_name}</p>
        <p><strong>Description:</strong> ${product.description || 'N/A'}</p>
        <p><strong>Stock:</strong> ${product.stock_quantity}</p>
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
            this.products = this.products.filter(p => p.product_id !== productId);
            this.totalPages = Math.ceil(this.products.length / this.productsPerPage);
            if (this.currentPage > this.totalPages && this.totalPages > 0) {
              this.currentPage = this.totalPages;
            }
            this.updatePaginatedProducts();
          },
          error: () => Swal.fire('Error', 'Failed to delete product', 'error')
        });
      }
    });
  }

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

        this.totalPages = Math.ceil(this.products.length / this.productsPerPage);
        this.updatePaginatedProducts();

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
        Swal.fire('Error', 'Failed to create product. Check backend logs.', 'error');
      }
    });
  }

}
