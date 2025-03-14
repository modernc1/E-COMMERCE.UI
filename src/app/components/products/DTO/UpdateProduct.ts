import { UpdateProductItem } from './productItem/UpdateProductItem';

export interface UpdateProduct {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  mainImage: File | null;
  materials: string;
  updateProductItems: UpdateProductItem[];
}
