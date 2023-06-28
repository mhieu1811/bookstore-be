import { TYPES } from '../config/types';
import { inject, injectable } from 'inversify';
import { Response, Request, NextFunction } from 'express';
import { IBookQuery, IBookService, ICreateBook } from '../interfaces';
import ApiError from '../utils/errors/apiError.error';
import createLogger from '../utils/logger';
import { Result, validationResult } from 'express-validator';

const logger = createLogger('Book Controller');
@injectable()
export class BookController {
  private readonly _bookService: IBookService;
  constructor(@inject(TYPES.Book) bookService: IBookService) {
    this._bookService = bookService;
  }

  async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Get List Book');
      const books = await this._bookService.getAllBooks();
      return res.status(200).json(books);
    } catch (err) {
      next(err);
    }
  }

  async getBookDetail(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Get Book Detail');
      const validationError: Result = await validationResult(req);

      if (!validationError.isEmpty()) throw new ApiError(400, 'Bad Request');
      //validate
      const { bookId } = req.params;
      const book = await this._bookService.getDetail(bookId);
      return res.status(200).json(book);
    } catch (err) {
      next(err);
    }
  }

  async createBook(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Create Book');
      const validationError: Result = await validationResult(req);
      console.log(validationError.array());
      if (!validationError.isEmpty()) throw new ApiError(400, 'Bad Request');
      //validate
      const { book } = req.body;
      const bookAdd: ICreateBook = {
        title: book.title,
        price: book.price,
        quantity: book.quantity,
        image: book.image,
        description: book.description,
        category: book.category,
        isDeleted: false,
      };

      await this._bookService.createBook(bookAdd);
      return res.status(201).json({ message: 'Add Book Successfully' });
    } catch (err) {
      next(err);
    }
  }

  async editBook(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Edit Book');
      const validationError: Result = await validationResult(req);

      if (!validationError.isEmpty()) throw new ApiError(400, 'Bad Request');
      //validate
      const { book } = req.body;
      const { bookId } = req.params;

      const bookEdit: ICreateBook = {
        title: book.title,
        price: book.price,
        quantity: book.quantity,
        image: book.image,
        description: book.description,
        category: book.category,
        isDeleted: book.isDeleted,
      };
      await this._bookService.editBook(bookId, bookEdit);
      return res.status(201).json({ message: 'Edit Book Successfully' });
    } catch (err) {
      next(err);
    }
  }

  async getBookPaginate(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('get Book (pagination)');
      const validationError: Result = await validationResult(req);

      if (!validationError.isEmpty()) throw new ApiError(400, 'Bad Request');
      //validate
      const search: string = req.query['search'] as string;
      const page: number = Number(req.query['page']);
      const category: string = req.query['category'] as string;
      const limit: number = Number(req.query['limit']);

      const query = {
        search: search,
        limit: limit,
        page: page,
        category: category,
      };

      // const query: IBookQuery = req.query;

      const books = await this._bookService.getByPaging(query);
      return res.status(201).json(books);
    } catch (err) {
      next(err);
    }
  }
}
