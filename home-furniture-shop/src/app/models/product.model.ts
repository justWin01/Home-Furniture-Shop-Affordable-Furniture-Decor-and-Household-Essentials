// models/product.model.ts
export interface Product {
  product_id: number;
  product_name: string;
  price: number;
  image?: string;
  description?: string;
  stock_quantity?: number;
  category_id: number;        // from backend
  category_name?: string;     // optional, for UI
}
