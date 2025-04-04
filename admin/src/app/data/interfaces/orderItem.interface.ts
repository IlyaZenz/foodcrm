import { ProductVariant } from './product-variant.interface'

export interface OrderItem {
  id: number;
  title: string;
  price: number;
  count: number;
  product:ProductVariant[];
}
