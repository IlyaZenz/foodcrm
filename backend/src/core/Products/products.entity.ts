import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Category } from "../categories/categorie.entity"

@Entity("Products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  titleKz: string

  @Column({default: true})
  isNew: boolean

  @Column({default: true})
  isActive: boolean

  @Column({default: false})
  isFavorite: boolean

  @Column()
  sortOrder: number

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}