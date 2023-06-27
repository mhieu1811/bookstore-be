import {
  FilterQuery,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { IBook, ICreateBook } from './IBook.interface';

export interface IBookService {
  getAllBooks(): Promise<IBook[]>;
  getDetail(bookId: string): Promise<IBook | null>;
  createBook(book: ICreateBook): Promise<IBook | null>;
  editBook(book: IBook): Promise<IBook | null>;
  checkoutBook(): string;
}
