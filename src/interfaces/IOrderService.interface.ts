import { IOrderItem } from './IOrder.interface';

export interface IOrderService {
  createOrder(orderItems: IOrderItem[]): Promise<string>;
}
