import { Schema } from 'express-validator';

export const editBookValidation: Schema = {
  bookId: {
    notEmpty: true,
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid bookId',
      bail: true,
    },
  },
  book: {
    notEmpty: true,
    in: ['body'],
  },
  'book.title': {
    notEmpty: true,
    in: ['body'],
  },
  'book.description': {
    notEmpty: true,
    in: ['body'],
  },
  'book.image': {
    notEmpty: true,
    in: ['body'],
  },
  'book.price': {
    notEmpty: true,
    isNumeric: true,
    in: ['body'],
  },
  'book.quantity': {
    notEmpty: true,
    isNumeric: true,
    in: ['body'],
  },
  'book.isDeleted': {
    notEmpty: true,
    isBoolean: true,
    in: ['body'],
  },
  'book.category': {
    notEmpty: true,
    in: ['body'],
    isIn: {
      options: [['Drama', 'Comedy', 'Sport']],
      errorMessage: 'Invalid category',
    },
  },
};
