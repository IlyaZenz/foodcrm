import { Category } from './category.interface'
import { Page } from './page.interface'

export interface ProductVariant  {
  id: number;
  title: string;
  titleKz?: string;
  price: number;
  oldPrice?: number;
  isActive: boolean;
  sortOrder: number;
  image?: string;
  desc?: string;
  descKz?: string;
  toggle?: string;
  composition?: string;
}
