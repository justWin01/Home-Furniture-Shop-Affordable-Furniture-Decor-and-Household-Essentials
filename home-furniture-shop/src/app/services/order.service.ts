// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderApi = 'http://localhost:5000/api/orders';
  private orderDetailsApi = 'http://localhost:5000/api/order_details';

  constructor(private http: HttpClient) {}

  placeOrder(product: Product, quantity: number = 1): Observable<any> {
    // Step 1: Create the order
    const orderBody = {
      user_id: Number(localStorage.getItem('user_id')), // assuming you store user_id
      status: 'Pending'
    };

    return this.http.post<any>(this.orderApi, orderBody).pipe(
      switchMap(orderRes => {
        // Step 2: Create order detail
        const orderDetailBody = {
          order_id: orderRes.order_id, // returned from backend
          product_id: product.product_id,
          quantity: quantity,
          subtotal: product.price * quantity
        };
        return this.http.post(this.orderDetailsApi, orderDetailBody);
      })
    );
  }
}
