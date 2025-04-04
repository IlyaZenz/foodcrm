import { Page } from './page.interface'
import { Product } from './product.interface'

export interface Category extends Page {
  products?: Product[]; // Продукты, относящиеся к категории
}
