import { injectable } from 'inversify';
import { IBook, IBookService, ICreateBook } from '../interfaces';
import Book from '../schemas/book.schema';

@injectable()
export class BookService implements IBookService {
  async getAllBooks(): Promise<IBook[]> {
    return await Book.find();
  }

  async getDetail(bookId: string): Promise<IBook | null> {
    console.log('A');
    return await Book.findOne({ _id: bookId });
  }

  async createBook(book: ICreateBook): Promise<IBook | null> {
    return await Book.create(book);
  }

  async editBook(book: IBook): Promise<IBook | null> {
    return await Book.findOneAndUpdate(book);
  }
  checkoutBook(): string {
    return 'A';
  }
}
