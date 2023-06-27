import 'reflect-metadata';
import express, { Express } from 'express';
import * as env from 'dotenv';
import { json } from 'body-parser';
import mongoose, { MongooseOptions } from 'mongoose';
import cors from 'cors';
import { BookController } from './controllers';
import container from './config/inversify.config';
env.config();

export default class App {
  private readonly port: number;
  private readonly uri: string;
  public app: Express = express();

  constructor(app: Express) {
    this.app = app;
    this.port = process.env.PORT ? Number(process.env.PORT) : 3000;
    this.uri = process.env.MONGO_URI ? process.env.MONGO_URI : '';
  }

  public connection() {
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
    this.initialMiddleware();
    this.initialRoute();
    this.app.listen(this.port, () =>
      console.log(`Server listening on http://localhost:${this.port}`),
    );
  }
  public initialMiddleware() {
    this.app.use(cors());
    this.app.use(json());

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  public initialRoute() {
    const bookController = container.resolve<BookController>(BookController);

    this.app.get('/api/books', bookController.getBooks.bind(bookController));
    this.app.get(
      '/api/books/:id',
      bookController.getBookDetail.bind(bookController),
    );

    this.app.post('/api/books', bookController.createBook.bind(bookController));
  }
}
