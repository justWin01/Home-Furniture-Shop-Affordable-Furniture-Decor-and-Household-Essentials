import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ordercustomer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordercustomer.component.html',
  styleUrls: ['./ordercustomer.component.css']
})
export class OrdercustomerComponent implements OnInit {

  orders: any[] = [];      // holds all order details for the customer
  gridColumns = 3;         // max columns per row
  private api = 'http://localhost:5000/api/order_details';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user?.user_id) {
      Swal.fire({
        icon: 'warning',
        title: 'You must log in first!',
        text: 'Please log in to view your orders.',
        confirmButtonText: 'Close'
      });
      return;
    }

    // Fetch only orders for the logged-in customer
    this.http.get<any[]>(`${this.api}?customer_id=${user.user_id}`).subscribe({
      next: details => this.orders = details,
      error: err => Swal.fire({
        icon: 'error',
        title: 'Error fetching orders',
        text: err.error?.message || 'Server error'
      })
    });
  }

  // Break orders into rows for grid display
  getRows() {
    const rows: any[][] = [];
    for (let i = 0; i < this.orders.length; i += this.gridColumns) {
      rows.push(this.orders.slice(i, i + this.gridColumns));
    }
    return rows;
  }

  // Show order details in a modal
  viewOrder(order: any) {
    Swal.fire({
      title: `Order #${order.order_id}`,
      html: `
        <p><strong>Product ID:</strong> ${order.product_id}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Subtotal:</strong> ₱${order.subtotal}</p>
      `,
      showCloseButton: true,
      confirmButtonText: 'Close'
    });
  }
}
