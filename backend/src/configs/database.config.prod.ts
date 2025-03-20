import { TypeOrmModuleOptions } from "@nestjs/typeorm"

const config: TypeOrmModuleOptions = {
  type: "postgres",
  host: "127.0.0.1",
  port: 5432, // Порт PostgreSQL
  username: "khancrm", // Имя пользователя
  password: "4X9-r-KlFT-q9QBk", // Пароль пользователя
  database: "khancrm", // Имя вашей базы данных
  synchronize: true, // Включите это только для разработки
  entities: ["dist/**/*.entity{.ts,.js}"],
  logging: true,
}

export default config
