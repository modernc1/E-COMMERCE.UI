import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryRequest } from '../../components/categories/DTO/categoryRequest';
import { ServiceResponse } from '../ServerResponse';
import { GetCategory } from '../../components/categories/DTO/GetCategory';
import { GetGender } from '../../components/categories/DTO/GetGenders';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiUrl = `${environment.apiUrl}/Category`
  constructor(private http: HttpClient) { }

  getAllCategories() : Observable<GetCategory[]>{
    return this.http.get<GetCategory[]>(this.apiUrl);
  }

  CreateCategory(request: CategoryRequest) : Observable<ServiceResponse>{
    const formDate = new FormData();
    formDate.append('name',request.name);
    formDate.append('genderId',request.genderId);
    if(request.image){
      formDate.append('image',request.image, request.image.name);
    }
    return this.http.post<ServiceResponse>(this.apiUrl, formDate);
  }

  updateCategory(request: CategoryRequest, id: string) : Observable<ServiceResponse>{
    const formDate = new FormData();
    formDate.append('name',request.name);
    formDate.append('genderId',request.genderId);
    if(request.image){
      formDate.append('image',request.image, request.image.name);
    }
    return this.http.put<ServiceResponse>(`${this.apiUrl}/${id}`, formDate);
  }

  deleteCategory(id: string) : Observable<ServiceResponse>{
    return this.http.delete<ServiceResponse>(`${this.apiUrl}/${id}`)
  }

  getGenders(loaded: boolean) : Observable<GetGender[]> {
    return this.http.get<GetGender[]>(`${this.apiUrl}/Genders/${loaded}`)
  }
  // getProductsByCategory(id: string) : Observable<CategoryResponse[]> {
  //   return this.http.get<CategoryResponse[]>(`${this.apiUrl}/${id}`);
  // }
}
