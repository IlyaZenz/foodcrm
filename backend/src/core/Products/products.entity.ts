import { Column, Entity, ManyToOne } from "typeorm"
import { Category } from "../categories/categorie.entity"
import { Page } from "../pages/pages.entity"

@Entity("products")
export class Product extends Page {

  @Column({default: true})
  isNew: boolean

  @Column({default: false})
  isFavorite: boolean

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}