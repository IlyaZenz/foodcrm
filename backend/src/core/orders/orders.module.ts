import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { OrdersService } from "./orders.service"
import { OrdersController } from "./controllers/order.controller"
import { Order } from "./orders.entity"
import { OrdersPublicController } from "./controllers/order-public.controller"

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController, OrdersPublicController],
})
export class OrdersModule {}