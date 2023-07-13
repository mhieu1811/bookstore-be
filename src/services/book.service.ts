import { injectable } from 'inversify';
import {
  IBook,
  IBookQuery,
  IBookService,
  ICreateBook,
  PageModel,
} from '../interfaces';
import Book from '../schemas/book.schema';
import KafkaService from '../utils/kafka/kafka.service';
import { KafkaTopics } from '../utils/kafka/topics';

@injectable()
export class BookService implements IBookService {
  private kafkaService = KafkaService.getInstance();

  async getAllBooks(): Promise<IBook[]> {
    return await Book.find();
  }

  async getDetail(bookId: string): Promise<IBook | null> {
    return await Book.findOne({ _id: bookId, isDeleted: false });
  }

  async createBook(book: ICreateBook): Promise<IBook | null> {
    const newBook = await Book.create(book);

    const bookKafka: IBook = {
      _id: newBook._id.toString(),
      title: newBook.title,
      image: newBook.image,
      quantity: newBook.quantity,
      price: newBook.price,
      description: newBook.description,
      category: newBook.category,
      isDeleted: newBook.isDeleted,
    };
    this.kafkaService.sendMessage(KafkaTopics.Book, {
      book: bookKafka,
      type: 'create',
    });
    return newBook;
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

    const result = await Book.aggregate([
      bookFilter.match,
      {
        $facet: {
          count: [{ $count: 'total' }],
          books: [{ $skip: startRow }, { $limit: query.limit }],
        },
      },
    ]);

    const books = result[0].books;
    const count = result[0].count[0] ? result[0].count[0].total : 0;

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
      totalItems: count,
      totalPages: totalPages,
      currentPage: query.page,
      items: returnBook,
    };
    return PagedResponseModel;
  }

  async filter(query: IBookQuery): Promise<any> {
    const filter: any = {};
    filter.isDeleted = false;
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
