import { Container } from 'inversify';
import { IBookService } from '../interfaces';
import { BookService } from '../services';
import { TYPES } from './types';
import { BookController } from '../controllers/book.controller';

const container = new Container();

container.bind<IBookService>(TYPES.Book).to(BookService).inRequestScope();

container.bind<BookController>(BookController).toSelf();

export default container;
