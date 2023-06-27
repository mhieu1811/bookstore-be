import { Document } from 'mongoose';
import { Category } from '../utils/category.enum';

export interface IBook {
  _id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  description: string;
  category: Category;
  createdDate: Date;
  isDeleted: boolean;
}

export interface ICreateBook {
  title: string;
  image: string;
  quantity: number;
  price: number;
  description: string;
  category: Category;
  createdDate: Date;
  isDeleted: boolean;
}
