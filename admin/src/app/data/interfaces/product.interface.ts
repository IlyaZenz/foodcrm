import { Category } from './category.interface'
import { Page } from './page.interface'
import { ProductVariant } from './product-variant.interface'

export interface Product extends Page {
  isNew: boolean;
  isFavorite: boolean;
  category?: Category;
  variants: ProductVariant[];
}
