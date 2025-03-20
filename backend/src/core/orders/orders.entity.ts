import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { OrderItem } from "./orderItems.entity"

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  status: string

  @Column()
  date: string

  @Column()
  totalPrice: number;

  @Column()
  paidBonuses: number;

  @Column()
  paidMoney: number;

  @Column()
  accruedBonuses: number;

  @Column()
  platform: string

  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];
}