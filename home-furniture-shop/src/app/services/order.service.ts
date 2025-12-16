import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';

interface User {
  user_id: number;
  full_name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersApi = 'http://localhost:5000/api/orders';
  private orderDetailsApi = 'http://localhost:5000/api/order_details';

  constructor(private http: HttpClient) {}

  /** Place a new order for a product */
  placeOrder(product: Product, quantity: number = 1): Observable<any> {
    const userStr = localStorage.getItem('user');
    const user: User | null = userStr ? JSON.parse(userStr) : null;

    if (!user?.user_id) {
      return throwError(() => new Error('User not logged in'));
    }

    // Step 1: Create the order
    const orderBody = {
      customer_id: user.user_id,
      status: 'Pending'
    };

    return this.http.post<{ order_id: number }>(this.ordersApi, orderBody).pipe(
      switchMap(orderRes => {
        if (!orderRes?.order_id) {
          return throwError(() => new Error('Failed to create order'));
        }

        // Step 2: Create order detail
        const orderDetailBody = {
          order_id: orderRes.order_id,
          product_id: product.product_id,
          quantity,
          subtotal: product.price * quantity
        };

        return this.http.post(this.orderDetailsApi, orderDetailBody);
      }),
      catchError(err => {
        console.error('Error placing order:', err);
        return throwError(() => new Error(err?.error?.message || 'Server error'));
      })
    );
  }

  /** Fetch all orders for the logged-in user */
  getUserOrders(): Observable<any[]> {
    const userStr = localStorage.getItem('user');
    const user: User | null = userStr ? JSON.parse(userStr) : null;

    if (!user?.user_id) {
      return throwError(() => new Error('User not logged in'));
    }

    return this.http.get<any[]>(`${this.orderDetailsApi}?customer_id=${user.user_id}`).pipe(
      catchError(err => {
        console.error('Error fetching orders:', err);
        return throwError(() => new Error(err?.error?.message || 'Server error'));
      })
    );
  }

  /** Fetch a single order detail by ID */
  getOrderDetailById(orderDetailId: number): Observable<any> {
    return this.http.get<any>(`${this.orderDetailsApi}/${orderDetailId}`).pipe(
      catchError(err => {
        console.error('Error fetching order detail:', err);
        return throwError(() => new Error(err?.error?.message || 'Server error'));
      })
    );
  }

  /** Update an order detail */
  updateOrderDetail(orderDetailId: number, data: any): Observable<any> {
    return this.http.put(`${this.orderDetailsApi}/${orderDetailId}`, data).pipe(
      catchError(err => {
        console.error('Error updating order detail:', err);
        return throwError(() => new Error(err?.error?.message || 'Server error'));
      })
    );
  }

  /** Delete an order detail */
  deleteOrderDetail(orderDetailId: number): Observable<any> {
    return this.http.delete(`${this.orderDetailsApi}/${orderDetailId}`).pipe(
      catchError(err => {
        console.error('Error deleting order detail:', err);
        return throwError(() => new Error(err?.error?.message || 'Server error'));
      })
    );
  }
}
