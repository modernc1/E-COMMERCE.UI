import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductImage } from '../../components/products/DTO/product';
import { ServiceResponse } from '../ServerResponse';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  apiUrl = `${environment.apiUrl}/product/productImage`

  constructor(private http: HttpClient) { }

  getImagesByProductId(id: string): Observable<ProductImage[]>{
    return this.http.get<ProductImage[]>(`${this.apiUrl}/${id}`);
  }

  deleteImageById(id: string): Observable<ServiceResponse>{
    return this.http.delete<ServiceResponse>(`${this.apiUrl}/${id}`);
  }

  
}
