import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("pages")
export class Page {
  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true})
  url: string

  @Column()
  title: string

  @Column({nullable: true})
  titleKz?: string

  @Column({nullable: true})
  seoTitle?: string

  @Column({nullable: true})
  seoDescription?: string

  @Column({default: false, nullable: true})
  isActive?: boolean

  @Column({default: 0})
  sortOrder: number
}
