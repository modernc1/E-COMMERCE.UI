import { GetProductVariation } from "./productVariation/GetProductVariation";

export interface GetProductItem {
    id: string;
    colorId: string;
    originalPrice: number;
    salePrice: number;
    imagesUrl: string[]
    productCode?: string
    productVariations: GetProductVariation[]
}
