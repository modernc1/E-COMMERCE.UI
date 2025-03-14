import { Component, OnDestroy, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { identity, Observable, Subscription } from 'rxjs';
import { GetProduct } from '../DTO/Getproduct';
import { ProductService } from '../../../services/productService/product.service';
import { CommonModule } from '@angular/common';
import { GetProductItem } from '../DTO/productItem/GetProductItem';
import { GetColor } from '../../../shared/DTO/GetColor';
import { GetSizeOption } from '../../../shared/DTO/GetSizeOption';
import { CartItem } from '../../../shared/DTO/cart/cartItem';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cartService/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy{
  product: GetProduct ={
    id: '',
    name: '',
    description: '',
    category: {
      id: '',
      name: '',
      genderId: '',
      imageUrl: ''
    },
    categoryId: '',
    materials: '',
    mainImageUrl: '',
    productItems: []
  }

  currentProductItem: GetProductItem = {
    id: '',
    colorId: '',
    originalPrice: 0,
    salePrice: 0,
    imagesUrl: [],
    productVariations: []
  }
  cartItem: CartItem = {
    product: {
      id: '',
      name: '',
      description: '',
      category: {
        id: '',
        name: '',
        genderId: '',
        imageUrl: ''
      },
      categoryId: '',
      materials: '',
      mainImageUrl: '',
      productItems: []
    },
    productItem: {
      id: '',
      colorId: '',
      originalPrice: 0,
      salePrice: 0,
      imagesUrl: [],
      productVariations: []
    },
    productVariation: {
      id: '',
      sizeOption: {
        id: '',
        name: ''
      },
      quantityInStock: 0
    },
    quantity: 0
  };
  cartItems: CartItem[] = []
  quantity: number = 1;
  colors: GetColor[] = [];
  sizes: GetSizeOption[] = [];
  selectedImg: string = '';
  selectedColor: GetColor = {
    id: '',
    name: '',
    hexCode: ''
  };

  Subscription: Subscription[] = []
  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,

  ){

  }

  ngOnInit() {

    const sb2 =this.activatedRoute.paramMap.subscribe({
      next: response => {
        const id = response.get('id');
        if(id){
          const sb3 = this.productService.getProductById(id).subscribe({
            next: response => {
              this.product = response;
              this.currentProductItem = this.product.productItems[0];
              this.selectedImg = this.product.mainImageUrl;

              const sb1 = this.productService.getColors().subscribe({
                next: response => {
                  this.product.productItems.forEach(pi => {
                    const color = response.find(c => c.id === pi.colorId)
                    if(color){
                      this.colors.push(color)
                    }
                  })
                }
              })

              const sb4 = this.productService.getSizeOptions().subscribe({
                next: response => {
                  this.currentProductItem.productVariations.forEach(pv => {
                    const size = response.find(s => s.id === pv.sizeOption.id)

                    if(size){
                      this.sizes.push(size);
                    }
                  })
                }
              })
              this.Subscription.push(sb1, sb4);
            }
          })
          this.Subscription.push(sb3);
        }
      },
      error: err =>{
        console.log(err);
      }
    })
    this.Subscription.push(sb2)
  }

  getDiscountPercent(originalPrice: number, salePrice:number){
    return Math.round((originalPrice - salePrice) / originalPrice * 100);
  }

  onColorChange(id: string){
    let pi = this.product.productItems.find(c => c.colorId === id)
    if(pi){
      this.currentProductItem = pi;
      this.selectedImg = pi.imagesUrl[0];
      this.selectedColor = this.colors.find(c => c.id === id)!;
    }

  }

  AddToCart(productItem: GetProductItem, selectedSizeId: string, quantity: number): void {
    const productV = productItem.productVariations.find(pv => pv.sizeOption.id === selectedSizeId)

    if(productV){
      this.cartItem.product = this.product;
      this.cartItem.product.productItems = []

      this.cartItem.productItem = productItem;
      this.cartItem.productItem.productVariations = [];

      this.cartItem.productVariation = productV;
      this.cartItem.quantity = quantity;
    }

    this.cartService.addToCart(this.cartItem)
  }

  onSelectImg(imgUrl: string): void{
    this.selectedImg = imgUrl;
  }

  ngOnDestroy(): void {

  }
}
