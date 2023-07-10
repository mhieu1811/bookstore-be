import { model, Schema } from 'mongoose';
import { IOrderItem } from '../interfaces';
const OrderItemSchema: Schema = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', require: true },
    price: { type: Number, require: true },
    quantity: { type: Number, require: true },
  },
  { versionKey: false },
);

const OrderItem = model<IOrderItem>('OrderItems', OrderItemSchema);
export default OrderItem;
