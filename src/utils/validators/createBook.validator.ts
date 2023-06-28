import { body, checkSchema, validationResult, Schema } from 'express-validator';
import mongoose from 'mongoose';
export const addBookValidation: Schema = {
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
  'book.category': {
    notEmpty: true,
    in: ['body'],
    isIn: {
      options: [['Drama', 'Comedy', 'Sport']],
      errorMessage: 'Invalid category',
    },
  },
};
