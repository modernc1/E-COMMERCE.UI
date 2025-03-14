import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServiceResponse } from '../ServerResponse';
import { CreateProduct } from '../../components/products/DTO/CreateProduct';
import { GetProduct } from '../../components/products/DTO/Getproduct';
import { GetColor } from '../../shared/DTO/GetColor';
import { GetSizeOption } from '../../shared/DTO/GetSizeOption';
import { FilterRequest } from '../../components/store/shoes-list/DTO/filterRequest';
import { GetAllProductResponse } from '../../components/store/shoes-list/DTO/getAllProductResponse';
import { UpdateProduct } from '../../components/products/DTO/UpdateProduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl = `${environment.apiUrl}/product`
  constructor(private http: HttpClient) { }

  getAllProducts(request?: FilterRequest) : Observable<GetAllProductResponse> {
    let reqParams = new HttpParams()
    if(request){
      if(request.genders){
        request.genders.forEach(g => {
          reqParams = reqParams.append('genders', g)
        })
      }
      if(request.categories){
        request.categories.forEach(cat => {
          reqParams = reqParams.append('categories', cat);
        })
      }
      if(request.sizes){
        request.sizes.forEach(size => {
          reqParams = reqParams.append('sizes', size);
        })
      }
      if(request.colors){
        request.colors.forEach(color => {
          reqParams = reqParams.append('colors', color)
        })
      }
      if(request.pageSize){
        reqParams = reqParams.append('pageSize' , request.pageSize)
      }
      if(request.sortBy){
        reqParams = reqParams.append('sortBy', request.sortBy)
      }
      if(request.sortOrder !== 'asc'){
        request.sortOrder = 'dec'
        reqParams = reqParams.append('sortOrder', request.sortOrder)
      }
      if(request.pageIndex !== 1){
        reqParams = reqParams.append('pageIndex', request.pageIndex)
      }
      if(request.filter && request.filter !== ''){
        reqParams = reqParams.append('filter',  request.filter)
      }
    }
    return this.http.get<GetAllProductResponse>(this.apiUrl, {params: reqParams});
  }

  getProductById(id: string) : Observable<GetProduct> {
    return this.http.get<GetProduct>(`${this.apiUrl}/${id}`)
  }

  CreateProduct(request: CreateProduct) : Observable<ServiceResponse>{
    const formData = new FormData();
    formData.append('name',request.name)
    formData.append('description',request.description)
    formData.append('categoryId',request.categoryId)
    if(request.mainImage){
      formData.append('mainImage',request.mainImage, request.mainImage?.name)
    }
    if(request.materials){
      formData.append('materials',request.materials)
    }
    request.createProductItems.forEach((productItem, index) => {
      formData.append(`createProductItems[${index}].colorId`, productItem.colorId)
      formData.append(`createProductItems[${index}].originalPrice`, productItem.originalPrice.toString())
      formData.append(`createProductItems[${index}].salePrice`, productItem.salePrice.toString())
      if(productItem.productCode){
        formData.append(`createProductItems[${index}].productCode`, productItem.productCode)
      }
      productItem.images.forEach((img) => {
        formData.append(`createProductItems[${index}].images`, img, img.name)
      })
      productItem.productVariations.forEach((productVariation, i) => {
        formData.append(`createProductItems[${index}].productVariations[${i}].sizeOptionId`, productVariation.sizeOptionId)
        formData.append(`createProductItems[${index}].productVariations[${i}].quantityInStock`, productVariation.quantityInStock.toString())
      })

    })

    console.log(request);

    // formData.append('quantity', request.quantity.toString())
    // request.images.forEach(image => {
    //   formData.append('images', image, image.name)
    // })

    return this.http.post<ServiceResponse>(this.apiUrl, formData);
  }

  updateProduct(request: UpdateProduct, id: string) : Observable<ServiceResponse>{
    const formData = new FormData();

    return this.http.put<ServiceResponse>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: string) : Observable<ServiceResponse>{
    return this.http.delete<ServiceResponse>(`${this.apiUrl}/${id}`)
  }

  getColors() : Observable<GetColor[]> {
    return this.http.get<GetColor[]>(`${this.apiUrl}Variation/colors`);
  }

  getSizeOptions() : Observable<GetSizeOption[]> {
    return this.http.get<GetSizeOption[]>(`${this.apiUrl}Variation/sizeOptions`);
  }

}
