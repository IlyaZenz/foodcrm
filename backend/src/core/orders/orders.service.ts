import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Order } from "./orders.entity"
import { Repository } from "typeorm"
import { addOrderDto } from "./dtos/add-order.dto"
import { OrderItem } from "./orderItems.entity"

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    @InjectRepository(OrderItem) private ordersRepository: Repository<OrderItem>
  ) {}
}
