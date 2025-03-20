import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm"
import { Role } from "./roles.enum"

@Entity("users")
@Unique(["login"])
export class User {
  /*
   *
   * Базовые поля для любого проекта
   *
   * */

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  login: string

  @Column()
  password: string // Хэшированный пароль пользователя

  @Column({
    type: "enum",
    enum: Role,
    array: true, // Если пользователь может иметь несколько ролей
    default: [], // Установите пустой массив по умолчанию
  })
  roles: Role[] // По умолчанию у пользователя нет никаких ролей

  /*
   *
   * Поля, специфичные для конкретного проекта
   *
   * */
}
