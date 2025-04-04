import { Platform } from '../enums/platform.enum'
import { OrderItem } from './orderItem.interface'

export interface Order {
  id: number;
  status: string; // Можешь заменить на 'status: StatusEnum;' после создания enum
  date: Date;
  totalPrice: number;
  paidBonuses: number;
  paidMoney: number;
  accruedBonuses: number;
  platform?: Platform; // Опциональное поле, так как nullable: true
  items: OrderItem[];
}
