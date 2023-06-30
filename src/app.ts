import 'reflect-metadata';
import express, { Express, Response, Request, NextFunction } from 'express';
import * as env from 'dotenv';
import mongoose, { MongooseOptions } from 'mongoose';
import cors from 'cors';
import { BookController } from './controllers';
import container from './config/inversify.config';
import ApiError from './utils/errors/apiError.error';
import createLogger from './utils/logger';
import {
  editBookValidation,
  addBookValidation,
  getBookDetailValidation,
} from './utils/validators';
import { checkSchema } from 'express-validator';
import { bookQuery } from './utils/validators/bookQuery.validator';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

env.config();

const logger = createLogger('Global Expection Handler');
export default class App {
  private readonly port: number;
  private readonly uri: string;
  public app: Express = express();

  constructor(app: Express) {
    this.app = app;
    this.port = process.env.PORT ? Number(process.env.PORT) : 3000;
    this.uri = process.env.MONGO_URI ? process.env.MONGO_URI : '';
  }

  private connection() {
    mongoose.set('strictQuery', true);
    mongoose
      .connect(this.uri, {
        useNewUrlParser: true,
      } as MongooseOptions)
      .then(() => {
        console.log('Connected to MongooDB');
      })
      .catch((err) => {
        console.log('Failed to connect to MongooDB, ', err.message);
      });
  }

  public async start() {
    this.connection();
    this.initMiddleware();
    this.initSwagger();
    this.initRoute();
    this.globalErrorHandler();
    this.app.listen(this.port, () =>
      console.log(`Server listening on http://localhost:${this.port}`),
    );
  }
  private initMiddleware() {
    this.app.use(cors());

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initRoute() {
    const bookController = container.get(BookController);

    this.app.get(
      '/api/books/:bookId',
      checkSchema(getBookDetailValidation),
      bookController.getBookDetail.bind(bookController),
    );

    this.app.post(
      '/api/books',
      checkSchema(addBookValidation),
      bookController.createBook.bind(bookController),
    );
    this.app.put(
      '/api/books/:bookId',
      checkSchema(editBookValidation),
      bookController.editBook.bind(bookController),
    );

    this.app.delete(
      '/api/books/:bookId',
      checkSchema(getBookDetailValidation),
      bookController.deleteBook.bind(bookController),
    );

    this.app.get(
      '/api/books',
      checkSchema(bookQuery),
      bookController.getBookPaginate.bind(bookController),
    );
  }

  private initSwagger() {
    const file = fs.readFileSync('./openapi.yaml', 'utf8');
    const swaggerDocument = YAML.parse(file);

    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument),
    );
  }

  private globalErrorHandler() {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        const error = err as ApiError;
        logger.error(error);
        res
          .status(error.statusCode ? error.statusCode : 500)
          .json(error.statusCode ? error.message : 'Internal Server Error');
      },
    );
  }
}
