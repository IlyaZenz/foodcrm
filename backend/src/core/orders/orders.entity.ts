import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { OrderItem } from "./orderItems.entity"

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  status: string // создать enum

  @CreateDateColumn() // ознакомиться и задать формат
  date: Date

  @Column({ default: 0 })
  totalPrice: number

  @Column({ default: 0 })
  paidBonuses: number

  @Column({ default: 0 })
  paidMoney: number

  @Column({ default: 0 })
  accruedBonuses: number

  @Column({nullable:true})
  platform?: string // создать enum

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[]
}