import { GetProduct } from "../../../components/products/DTO/Getproduct";
import { GetProductItem } from "../../../components/products/DTO/productItem/GetProductItem";
import { GetProductVariation } from "../../../components/products/DTO/productItem/productVariation/GetProductVariation";

export interface CartItem{
  product: GetProduct;
  productItem: GetProductItem;
  productVariation: GetProductVariation;
  quantity: number;
}
