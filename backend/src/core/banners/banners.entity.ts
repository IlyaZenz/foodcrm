import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("banners")
export class Banner {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  url: string

  @Column({nullable: true})
  content: string

  @Column()
  title: string

  @Column({nullable: true})
  image?: string

  @Column({default: 0})
  sortOrder: number
}
