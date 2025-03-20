import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Product } from "../Products/products.entity"

@Entity("Categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  url: string

  @Column()
  title: string

  @Column()
  titleKz: string

  @Column({default: true})
  isActive: boolean

  @Column()
  sortOrder: number

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

}