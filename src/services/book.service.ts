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
    return await Book.findOne({ _id: bookId, isDeleted: false });
  }

  async createBook(book: ICreateBook): Promise<IBook | null> {
    return await Book.create(book);
  }

  async editBook(bookId: string, book: ICreateBook): Promise<IBook | null> {
    return await Book.findByIdAndUpdate(bookId, book);
  }

  async deleteBook(bookId: string): Promise<IBook | null> {
    return await Book.findByIdAndUpdate(bookId, { isDeleted: true });
  }

  async getByPaging(bookQueryCriteria: IBookQuery): Promise<PageModel<IBook>> {
    const query = {
      search: bookQueryCriteria.search ?? '',
      limit: bookQueryCriteria.limit ? bookQueryCriteria.limit : 12,
      page: bookQueryCriteria.page ? bookQueryCriteria.page : 1,
      category: bookQueryCriteria.category ?? '',
    } as IBookQuery;

    const bookFilter = await this.filter(query);

    const startRow = (query.page - 1) * query.limit;

    const result = await Book.aggregate([bookFilter.match, {
      $facet: {
        count: [
          { $count: 'total' }
        ],
        books: [
          { $skip: startRow },
          { $limit: query.limit }
        ]
      }
    }], {

    })

    let count: number = 0

    const books = result[0].books
    if (result[0].count[0])
      count = result[0].count[0].total;

    const totalPages = Math.ceil(count / query.limit);
    const returnBook: IBook[] = books.map((book: IBook) => {
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
      pageSize: query.limit,
      totalItems: returnBook.length,
      totalPages: totalPages,
      currentPage: query.page,
      items: returnBook,
    };
    return PagedResponseModel;
  }

  async filter(query: IBookQuery): Promise<any> {
    const filter: any = {};
    filter.isDeleted = false
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

}
