import { IBook, ICreateBook } from './IBook.interface';
import { IBookQuery } from './IBookQuery.interface';
import { PageModel } from './IPageModel.interface';

export interface IBookService {
  getAllBooks(): Promise<IBook[]>;
  getDetail(bookId: string): Promise<IBook | null>;
  createBook(book: ICreateBook): Promise<IBook | null>;
  editBook(bookId: string, book: ICreateBook): Promise<IBook | null>;
  getByPaging(bookQueryCriteria: IBookQuery): Promise<PageModel<IBook>>;
}
