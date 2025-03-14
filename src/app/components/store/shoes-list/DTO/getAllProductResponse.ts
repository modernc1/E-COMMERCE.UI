import { GetProduct } from "../../../products/DTO/Getproduct";

export interface GetAllProductResponse
{
  products: GetProduct[]
  totalCount: number
  totalPageCount: number
  currentPage: number
  itemFrom:number
  itemTo: number
}
