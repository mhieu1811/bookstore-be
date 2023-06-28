import { Schema } from 'express-validator';

export const getBookDetailValidation: Schema = {
  bookId: {
    notEmpty: true,
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid bookId',
      bail: true,
    },
  },
};
