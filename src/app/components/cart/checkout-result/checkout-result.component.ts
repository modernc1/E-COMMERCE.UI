import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../../services/cartService/cart.service';
import { tap } from 'rxjs';
import { GetCheckoutDetails } from '../DTO/GetCheckoutDetails';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-result',
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-result.component.html',
  styleUrl: './checkout-result.component.css'
})
export class CheckoutResultComponent implements OnInit{
  tapId: string | null = null;
  paymentStatus: string = ""
  checkoutDetails: GetCheckoutDetails[] = [];
  constructor(private route: ActivatedRoute, private cartService: CartService) {}
  ngOnInit(): void {
    this.tapId = this.route.snapshot.queryParamMap.get('tap_id');
    if(this.tapId){
      this.cartService.getPaymentStatus(this.tapId).subscribe({
        next: response => {
          console.log(response)
          this.paymentStatus = response.status
          if(this.paymentStatus === 'CAPTURED'){
            localStorage.removeItem('cart');
            this.cartService.updateCartLength()
          }
        },
        error: err => {
          console.log(err);
        }
      })

      this.cartService.getCheckoutHistoryDetails(this.tapId).subscribe({
        next: response => {
          console.log(response);
          this.checkoutDetails = response;
        },
        error: err => {
          console.log(err)
        }
      })
    }
    else{
      this.paymentStatus = "Error Occured"
    }
  }

  countTotalPrice(): number{
    let totalAmount = 0;
    this.checkoutDetails.forEach(ci => {
      totalAmount = totalAmount + (ci.product.productItem.salePrice * ci.quantity)
    })
    return totalAmount;
  }
}
