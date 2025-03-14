import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cartService/cart.service';
import { CartItem } from '../../../shared/DTO/cart/cartItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  products: CartItem[] = [];

  constructor(private cartService: CartService,
    private AuthService: AuthService,

  ){}


  ngOnInit(): void {
    this.products = this.cartService.getCartItems();
    console.log(this.AuthService.getUser())
  }

  removeCartItem(index: number){
    this.cartService.removeFromCart(index);
    this.ngOnInit()
  }

  onQuantityChange(){
    localStorage.setItem('cart', JSON.stringify(this.products));
  }
}
