export interface IOrderItem {
  bookId: string;
  quantity: number;
}
export interface IOrder {
  orderId: string;
  dateCreated: Date;
  items: IOrderItem[];
}
