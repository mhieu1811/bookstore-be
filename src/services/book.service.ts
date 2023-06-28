import { injectable } from 'inversify';
import {
  IBook,
  IBookQuery,
  IBookService,
  ICreateBook,
  PageModel,
} from '../interfaces';
import Book from '../schemas/book.schema';

@injectable()
export class BookService implements IBookService {
  async getAllBooks(): Promise<IBook[]> {
    return await Book.find();
  }

  async getDetail(bookId: string): Promise<IBook | null> {
    return await Book.findOne({ _id: bookId });
  }

  async createBook(book: ICreateBook): Promise<IBook | null> {
    return await Book.create(book);
  }

  async editBook(bookId: string, book: ICreateBook): Promise<IBook | null> {
    return await Book.findByIdAndUpdate(bookId, book);
  }

  async getByPaging(bookQueryCriteria: IBookQuery): Promise<PageModel<IBook>> {
    const query = {
      search: bookQueryCriteria.search ?? '',
      limit: bookQueryCriteria.limit ? bookQueryCriteria.limit : 12,
      page: bookQueryCriteria.page ? bookQueryCriteria.page : 1,
      category: bookQueryCriteria.category ?? '',
    } as IBookQuery;

    console.log(query);
    const bookFilter = await this.filter(query);
    const paged = await this.paging(query, bookFilter.match);

    const startRow = (await (paged.currentPage - 1)) * paged.pageSize;

    const books = await Book.aggregate([bookFilter.match])
      .skip(startRow)
      .limit(paged.pageSize);

    const returnBook: IBook[] = books.map((book) => {
      return {
        _id: book._id,
        title: book.title,
        image: book.image,
        quantity: book.quantity,
        price: book.price,
        description: book.description,
        category: book.category,
        isDeleted: book.isDeleted,
      };
    });

    const PagedResponseModel: PageModel<IBook> = {
      pageSize: paged.pageSize,
      totalItems: returnBook.length,
      totalPages: paged.totalItems,
      currentPage: paged.currentPage,
      items: returnBook,
    };
    return PagedResponseModel;
  }

  async filter(query: IBookQuery): Promise<any> {
    const filter: any = {};
    if (typeof query.search != 'undefined' && query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    if (query.category) {
      filter.category = query.category;
    }
    const bookFilter = {
      match: { $match: filter },
    };

    return bookFilter;
  }

  async paging(query: IBookQuery, filter: any): Promise<PageModel<IBook>> {
    const paged = {} as PageModel<IBook>;

    paged.currentPage = query.page < 0 ? 1 : query.page;
    paged.pageSize = query.limit || 12;

    paged.totalPages = Math.ceil(paged.totalItems / paged.pageSize);
    return paged;
  }
}
