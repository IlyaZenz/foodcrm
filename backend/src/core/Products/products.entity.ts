import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Category } from "../categories/categorie.entity"
import { Page } from "../pages/pages.entity"
import { ProductVariant } from "./productVariant.entity"

@Entity("products")
export class Product extends Page {

  @PrimaryGeneratedColumn()
  id: number

  @Column({default: true})
  isNew: boolean

  @Column({default: false})
  isFavorite: boolean

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => ProductVariant, variant => variant.product, { cascade: true })
  variants: ProductVariant[];
}