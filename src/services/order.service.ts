// import { injectable } from 'inversify';
// import { IOrder, IOrderItem, IOrderService } from '../interfaces';
// import Order from '../schemas/order.schema';
// import OrderItem from '../schemas/orderItem.schema';

// @injectable()
// export class OrderService implements IOrderService {
//   async createOrder(orderItem: IOrderItem[]): Promise<string> {
//     const orderItemId: string[] = await orderItem.map(async (order) => {
//       const orderItem = await OrderItem.create(order);
//       return orderItem._id.toString();
//     });

//     console.log(await orderItem);
//     const order = await Order.create();
//     return 'a';
//   }
// }
