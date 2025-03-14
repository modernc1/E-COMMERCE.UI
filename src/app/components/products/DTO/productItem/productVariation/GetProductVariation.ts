import { GetSizeOption } from "../../../../../shared/DTO/GetSizeOption";

export interface GetProductVariation{
  id: string;
  sizeOption: GetSizeOption;
  quantityInStock: number;
}
