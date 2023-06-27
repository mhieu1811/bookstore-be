import { model, Schema, Model, Document } from 'mongoose';
import { IBook } from '../interfaces';
import { Category } from '../utils/category.enum';
const BookSchema: Schema = new Schema(
  {
    title: { type: String, required: true, maxlength: 30 },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: Category,
      default: Category.drama,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false },
);

const Book = model<IBook>('Books', BookSchema);
export default Book;
