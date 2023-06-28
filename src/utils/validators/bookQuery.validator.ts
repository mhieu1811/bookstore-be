import { Schema } from 'express-validator';

export const bookQuery: Schema = {
  search: {
    in: ['query'],
    isString: true,
    optional: true,
  },
  category: {
    in: ['query'],
    isString: true,
    optional: true,
  },
  limit: {
    in: ['query'],
    isInt: true,
    optional: true,
  },
  page: {
    in: ['query'],
    isInt: true,
    optional: true,
  },
};
