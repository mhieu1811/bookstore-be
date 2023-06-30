import App from './app';
import express, { Express } from 'express';

export const start = async () => {
  try {
    const app: Express = express();
    const server = new App(app);
    await server.start();
  } catch (err) {
    throw err;
  }
};

start();
