import { Schema } from 'express-validator';

export const addBookValidation: Schema = {
  title: {
    notEmpty: true,
    in: ['body'],
  },
  description: {
    notEmpty: true,
    in: ['body'],
  },
  image: {
    notEmpty: true,
    in: ['body'],
  },
  price: {
    notEmpty: true,
    isNumeric: true,
    in: ['body'],
  },
  quantity: {
    notEmpty: true,
    isNumeric: true,
    in: ['body'],
  },
  category: {
    notEmpty: true,
    in: ['body'],
    isIn: {
      options: [['Drama', 'Comedy', 'Sport']],
      errorMessage: 'Invalid category',
    },
  },
};
