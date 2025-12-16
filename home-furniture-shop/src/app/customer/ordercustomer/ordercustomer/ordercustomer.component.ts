import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ordercustomer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordercustomer.component.html',
  styleUrls: ['./ordercustomer.component.css']
})
export class OrdercustomerComponent implements OnInit {
  orders: any[] = [];
  gridColumns = 3;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: details => {
        this.orders = details;
        if (!details.length) {
          Swal.fire('No Orders', 'You have not placed any orders yet.', 'info');
        }
      },
      error: err => Swal.fire('Error', err.message || 'Server error', 'error')
    });
  }

  getRows(): any[][] {
    const rows: any[][] = [];
    for (let i = 0; i < this.orders.length; i += this.gridColumns) {
      rows.push(this.orders.slice(i, i + this.gridColumns));
    }
    return rows;
  }

  viewOrder(order: any): void {
    Swal.fire({
      title: `Order #${order.order_id}`,
      html: `
        <img src="${order.product_image}" alt="${order.product_name}" style="width:100%; height:120px; object-fit:cover; margin-bottom:10px;" />
        <p><strong>Product:</strong> ${order.product_name}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Subtotal:</strong> ₱${order.subtotal}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Order Date:</strong> ${new Date(order.order_date).toLocaleString()}</p>
      `,
      showCloseButton: true,
      confirmButtonText: 'Close'
    });
  }
}
