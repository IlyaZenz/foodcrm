import { TypeOrmModuleOptions } from "@nestjs/typeorm"

const config: TypeOrmModuleOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432, // Порт PostgreSQL
  username: "postgres", // Имя пользователя
  password: "insert", // Пароль пользователя
  database: "food", // Имя вашей базы данных
  synchronize: true, // Включите это только для разработки
  entities: ["dist/**/*.entity{.ts,.js}"],
  logging: true,
}

export default config
