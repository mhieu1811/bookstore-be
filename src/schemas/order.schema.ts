import { model, Schema, Model, Document } from 'mongoose';
import { IOrder } from '../interfaces';
const OrderSchema: Schema = new Schema(
  {
    dateCreated: { type: Date, require: true, default: Date.now },
    totalPrice: { type: Number, require: true },
    items: [{ type: Schema.Types.ObjectId, ref: 'OrderItem', require: true }],
  },
  { versionKey: false },
);

const Order = model<IOrder>('Orders', OrderSchema);
export default Order;
