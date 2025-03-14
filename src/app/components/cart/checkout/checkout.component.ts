import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../../shared/DTO/cart/cartItem';
import { CartService } from '../../../services/cartService/cart.service';
import { CommonModule } from '@angular/common';
import { ProcessCart } from '../DTO/processCart';
import { Router } from '@angular/router';
import { Address } from '../DTO/Address';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{

  cartItems: CartItem[] = []
  processCartItems: ProcessCart[] = []
  Address: Address = {
    state: '',
    city: '',
    street: '',
    phoneNumber: ''
  }
  constructor(private cartService: CartService,
    private router: Router,

  ){}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  countTotalPrice(): number{
    let totalAmount = 0;
    this.cartItems.forEach(ci => {
      totalAmount = totalAmount + (ci.productItem.salePrice * ci.quantity)
    })
    return totalAmount;
  }

  proceedPayment() {
    this.cartItems.forEach(ci => {
      this.processCartItems.push({
        productId: ci.product.id,
        productItemId: ci.productItem.id,
        productVariationId: ci.productVariation.id,
        quantity: ci.quantity})
    })
    this.cartService.createCheckout(this.processCartItems, this.Address).subscribe({
      next: response => {
        window.location.href = response.transaction.url
      },
      error: err => {
        console.log(err);
      }
    })

  }
}
