import { GetCategory } from "../../categories/DTO/GetCategory";
import { GetProductItem } from "./productItem/GetProductItem";

export interface GetProduct {
  id: string;
  name: string;
  description: string;
  category: GetCategory;
  categoryId: string;
  materials: string;
  mainImageUrl: string;
  productItems: GetProductItem[];
}

