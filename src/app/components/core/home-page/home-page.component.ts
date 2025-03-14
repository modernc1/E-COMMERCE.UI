import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetProduct } from '../../products/DTO/Getproduct';
import { ProductService } from '../../../services/productService/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, OnDestroy{
  products: GetProduct[] = []

  subscriptions: Subscription[] = [];
  constructor(private productService: ProductService,

  ) {}

  ngOnInit(): void {
    const sb1 = this.productService.getAllProducts().subscribe({
      next: response => {
        this.products = response.products;

      },
      error: err => {
        console.log(err);
      }
    })
    this.subscriptions.push(sb1)
  }

  getDiscountPercent(originalPrice: number, salePrice:number){
    return Math.round((originalPrice - salePrice) / originalPrice * 100);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => {
      sb.unsubscribe();
    })
  }

}
