import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Product } from "../Products/products.entity"
import { Page } from "../pages/pages.entity"

@Entity("categories")
export class Category extends Page {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

}