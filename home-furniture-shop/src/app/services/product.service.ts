// services/product.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  create(data: any, image?: File): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (image) formData.append('image', image);
    return this.http.post(this.api, formData);
  }

  update(id: number, data: any, image?: File): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (image) formData.append('image', image);
    return this.http.put(`${this.api}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
