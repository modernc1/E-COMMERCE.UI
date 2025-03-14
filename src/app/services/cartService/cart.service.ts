import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../shared/DTO/cart/cartItem';
import { environment } from '../../environments/environment';
import { CreateCheckoutRresponse } from '../../components/cart/DTO/CreateCheckoutResponse';
import { HttpClient } from '@angular/common/http';
import { ProcessCart } from '../../components/cart/DTO/processCart';
import { GetCheckoutDetails } from '../../components/cart/DTO/GetCheckoutDetails';
import { Address } from '../../components/cart/DTO/Address';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemSubject = new BehaviorSubject<number>(this.getCartItemsLength())
  private apiUrl = `${environment.apiUrl}/cart`

  cartItem$ = this.cartItemSubject.asObservable()
  constructor(private http: HttpClient) {
    window.addEventListener('storage', event => {
      if(event.key === 'cart'){
        this.updateCartLength()
      }
    })
  }

  private getCartItemsLength(): number {
    const cartItems = JSON.parse(localStorage.getItem('cart')!) as CartItem[];
    return cartItems? cartItems.length : 0;
  }

  getCartItems(): CartItem[] {
    return JSON.parse(localStorage.getItem('cart')!) as CartItem[]
  }

  updateCartLength() {
    this.cartItemSubject.next(this.getCartItemsLength())
  }

  addToCart(item: CartItem) {
    // const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    // cartItems.push(item);
    // localStorage.setItem('cartItems', JSON.stringify(cartItems));
    var cartItems = JSON.parse(localStorage.getItem('cart')!) as CartItem[];
    if(!cartItems){
      cartItems = []
      cartItems[0] = item;
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
    else{
      var isThere = false;
      cartItems.forEach(ci => {
        if(ci.productVariation.id === item.productVariation.id){
          ci.quantity = ci.quantity + item.quantity;
          isThere = true
        }
      })

      if(!isThere){
        cartItems.push(item)
      }
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }

    this.updateCartLength();
  }

  removeFromCart(index: number) {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    this.updateCartLength();
  }

  createCheckout(cartItems: ProcessCart[], address: Address) : Observable<CreateCheckoutRresponse>{
    return this.http.post<CreateCheckoutRresponse>(`${this.apiUrl}/CreateCheckout`,
      {
        paymentMethod: 'card',
        cartItems: cartItems,
        state: address.state,
        city: address.city,
        street: address.street,
        phoneNumber: address.phoneNumber
      })
  }

  getPaymentStatus(charge_Id: string) : Observable<{status: string}> {
    return this.http.get<{status: string}>(`${this.apiUrl}/PaymentStatus/${charge_Id}`);
  }

  getCheckoutHistoryDetails(charge_id: string) : Observable<GetCheckoutDetails[]>{
    return this.http.get<GetCheckoutDetails[]>(`${this.apiUrl}/CheckoutDetails/${charge_id}`)
  }
}
