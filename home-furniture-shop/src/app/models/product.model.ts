// models/product.model.ts
import { Category } from './category.model';

export interface Product {
  product_id: number;
  product_name: string;
  price: number;
  image?: string;
  description?: string;
  category?: Category; // optional, avoids TS errors if no category
}
