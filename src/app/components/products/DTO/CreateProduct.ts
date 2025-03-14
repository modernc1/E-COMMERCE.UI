import { CreateProductItem } from './productItem/CreateProductItem';

export interface CreateProduct {
  name: string;
  description: string;
  categoryId: string;
  mainImage: File | null;
  materials: string;
  createProductItems: CreateProductItem[];
}
