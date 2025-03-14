import { CreateProductVariation } from "./productVariation/CreateProductVariation";

export interface CreateProductItem {
  colorId: string;
  originalPrice: number;
  salePrice: number;
  images: File[]
  productCode?: string
  productVariations: CreateProductVariation[]
}
