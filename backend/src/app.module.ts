import { Module } from "@nestjs/common"
import { AuthUsersModule } from "./core/auth-users/auth-users.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { BannersModule } from "./core/banners/banners.module"
import { CategoriesModule } from "./core/categories/categories.module"
import { ProductsModule } from "./core/Products/products.module"

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const config =
          process.env.NODE_ENV === "prod"
            ? await import("./configs/database.config.prod")
            : await import("./configs/database.config.dev")
        return config.default
      },
    }),
    // Статические файлы при разработке на localhost
    // ...(process.env["NODE_ENV"] === "dev"
    //   ? [
    //     ServeStaticModule.forRoot({
    //       rootPath: join(__dirname, "..", "files", "upload").replace(/\\/g, "/"),
    //       serveRoot: "/upload/",
    //     }),
    //     ]
    //   : []),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "files", "upload"),
      serveRoot: "/upload/",
    }),

    AuthUsersModule,BannersModule,CategoriesModule,ProductsModule
  ],
})
export class AppModule {}
