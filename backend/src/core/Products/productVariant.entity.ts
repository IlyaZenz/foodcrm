import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Product } from "./products.entity"

@Entity()
export class ProductVariant {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  titleKz: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  oldPrice: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({default: 0})
  sortOrder: number;

  @Column({ nullable: true })
  image: string;

  @Column('text', { nullable: true })
  desc: string;

  @Column('text', { nullable: true })
  descKz: string;

  @Column({ nullable: true })
  toggle: string;

  @Column('text', { nullable: true })
  composition: string;

  @ManyToOne(() => Product, product => product.variants)
  product: Product;
}