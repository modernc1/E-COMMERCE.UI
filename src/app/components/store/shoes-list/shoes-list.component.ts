import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetProduct } from '../../products/DTO/Getproduct';
import { CommonModule } from '@angular/common';
import { GetColor } from '../../../shared/DTO/GetColor';
import { GetSizeOption } from '../../../shared/DTO/GetSizeOption';
import { GetCategory } from '../../categories/DTO/GetCategory';
import { ProductService } from '../../../services/productService/product.service';
import { CategoryService } from '../../../services/categoryService/category.service';
import { Subscription } from 'rxjs';
import { GetGender } from '../../categories/DTO/GetGenders';
import { FilterRequest } from './DTO/filterRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shoes-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './shoes-list.component.html',
  styleUrl: './shoes-list.component.css'
})
export class ShoesListComponent implements OnInit, OnDestroy{

  products: GetProduct[] = [];
  genders: GetGender[] = []
  categories: GetCategory[] = [];
  colors: GetColor[] = [];
  sizes: GetSizeOption[] = [];
  pages: number = 0;
  currentPage: number = 1;
  filterRequest: FilterRequest = {
    genders: [],
    sizes: [],
    categories: [],
    colors: [],
    pageIndex: 1,
    sortOrder: 'asc'
  };

  notFoundMessage?: string;
  subscriptions: Subscription[] = [];
  constructor(private productService: ProductService,
    private categoryService: CategoryService,

  ){}

  ngOnInit(): void {
    this.loadProducts();
    this.loadGenders();
    this.loadCategories();
    this.loadColors();
    this.loadSizes();
  }

  loadProducts(): void{
    this.filterRequest.pageSize = 10;
    const sb = this.productService.getAllProducts(this.filterRequest).subscribe({
      next: response => {
        this.products = response.products;
        this.pages = response.totalPageCount;
        this.currentPage = response.currentPage;
        this.notFoundMessage = undefined
      },
      error: err => {
        const error = err as HttpErrorResponse;
        if(error.status === 404){
          this.notFoundMessage = "Try Adjusting Your Filters"
          this.products = [];
        }
        else{
          this.notFoundMessage = "Error Happened!... Try Again Later"
        }
      }
    });
    this.subscriptions.push(sb);
  }
  loadGenders(): void {
    const sb = this.categoryService.getGenders(false).subscribe({
      next: response => {
        this.genders = response;
      },
      error: err => {
        console.log(err);
      }
    })
    this.subscriptions.push(sb);
  }
  loadCategories(): void {
    const sb = this.categoryService.getAllCategories().subscribe({
      next: response => {
        this.categories = response;
      },
      error: err => {
        console.log(err);
      }
    })
    this.subscriptions.push(sb);
  }
  loadColors(): void {
    const sb = this.productService.getColors().subscribe({
      next: response => {
        this.colors = response;
      },
      error: err => {
        console.log(err);
      }
    })
    this.subscriptions.push(sb);
  }
  loadSizes(): void {
    const sb = this.productService.getSizeOptions().subscribe({
      next: respons => {
        this.sizes = respons;
      },
      error: err => {
        console.log(err)
      }
    })
    this.subscriptions.push(sb);
  }

  getPages(): number[]{
    return Array.from({length: this.pages}, (_, i) => i)
  }

  onCheckboxChange(event: Event, gender?: string,size?: string, color?: string, category?: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.filterRequest.pageIndex = 1;
    if (isChecked) {
      if(gender){
        this.filterRequest.genders.push(gender);
      }
      if(size){
        this.filterRequest.sizes.push(size)
      }
      if(color){
        this.filterRequest.colors.push(color)
      }
      if(category){
        this.filterRequest.categories.push(category)
      }
    }else {
      if(gender){
        this.filterRequest.genders = this.filterRequest.genders.filter(g => g !== gender);
      }
      if(size){
        this.filterRequest.sizes = this.filterRequest.sizes.filter(s => s !== size);
      }
      if(color){
        this.filterRequest.colors = this.filterRequest.colors.filter(c => c !== color);
      }
      if(category){
        this.filterRequest.categories = this.filterRequest.categories.filter(c => c !== category);
      }
    }

    this.loadProducts();
  }

  onSearch(){
    this.loadProducts();
  }

  getDiscountPercent(originalPrice: number, salePrice:number){
    return Math.round((originalPrice - salePrice) / originalPrice * 100);
  }

  onSelectPage(page: number): void{
    this.filterRequest.pageIndex = page;
    this.loadProducts()
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => {
      sb.unsubscribe();
    })
  }

}
