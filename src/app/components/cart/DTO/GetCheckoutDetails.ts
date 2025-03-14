import { GetProduct } from "../../products/DTO/Getproduct";

export interface GetCheckoutDetails{
  tapId: string;
  productId: string;
  product: ProductCart;
  productItemId:string;
  ProductVariationId: string;
  quantity: number
  userId:string
  dateTime: Date;
  status: string;
}

interface ProductCart{
  id: string;
  name: string;
  productItem: ProductItemCart
}

interface ProductItemCart {
  id: string;
  originalPrice: number;
  salePrice: number;
  productVariation: ProductVariationCart
}

interface ProductVariationCart{
  id: string;
  quantity: number;
}
