import { UpdateProductVariation } from "./productVariation/UpdateProductVariation";

export interface UpdateProductItem {

  id?: string
  productId?: string
  colorId: string
  originalPrice: number
  salePrice: number
  images: File[]
  productCode?: string
  productVariations: UpdateProductVariation

}
