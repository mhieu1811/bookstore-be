import { TYPES } from '../config/types';
import { BookService } from '../services';
import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
@injectable()
export class BookController {
  private readonly _bookService: BookService;
  constructor(@inject(TYPES.Book) bookService: BookService) {
    this._bookService = bookService;
  }

  async getBooks(req: Request, res: Response) {
    try {
      const books = await this._bookService.getAllBooks();
      return res.status(200).json(books);
    } catch (err) {}
  }

  async getBookDetail(req: Request, res: Response) {
    try {
      console.log('AAAA');
      //validate
      const { id } = req.params;
      const book = await this._bookService.getDetail(id);
      return res.status(200).json(book);
    } catch (err) {
      console.log(err);
    }
  }

  async createBook(req: Request, res: Response) {
    try {
      //validate
      const { book } = req.body;
      const newBook = await this._bookService.createBook(book);
      return res.status(200).json(book);
    } catch (err) {
      console.log(err);
    }
  }
}
