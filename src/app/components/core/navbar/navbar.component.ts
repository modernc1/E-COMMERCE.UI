import { Component, OnDestroy, OnInit } from '@angular/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, Route } from '@angular/router';
import { GetGender } from '../../categories/DTO/GetGenders';
import { CategoryService } from '../../../services/categoryService/category.service';
import { Subscription, Observable } from 'rxjs';
import { RouterLinkActive } from '@angular/router';
import { CartItem } from '../../../shared/DTO/cart/cartItem';
import { CartService } from '../../../services/cartService/cart.service';
import { AuthService } from '../../auth/service/auth.service';
import { CurrUser } from '../../auth/DTO/currUser';

@Component({
  selector: 'app-navbar',
  imports: [//Menubar,
  CommonModule,
  RouterLink,
  RouterLinkActive,
  BadgeModule,
  AvatarModule,
  InputTextModule,
  //Ripple,
  CommonModule,
        ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy
{
  items : MenuItem[] | undefined
  megaItems: MegaMenuItem[] | undefined;
  cartItemsNumber: number = 0;
  $genders?: Observable<GetGender[]>;
  ImagePreview: string = '';
  subscriptions: Subscription[] = [];
  isAuthenticated = false;
  isAdmin = false;
  currUser? : CurrUser;
  constructor(private router: Router,
    private categoryService: CategoryService,
    private cartService: CartService,
    private authService: AuthService,

  ){}


  ngOnInit() {
    const sb1 = this.cartService.cartItem$.subscribe(count => {
      this.cartItemsNumber = count;
    })
    const sb2 = this.authService.user$.subscribe({
      next: user => {
        if(user){
          this.currUser = {
            fullName: user.fullName,
            email: user.email,
            role: user.role
          }
          this.isAdmin = user.role === 'Admin'
        }

        console.log(user)
        this.isAuthenticated = user !== null;
      }
    })

    this.subscriptions.push(sb1, sb2)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb=> {
      sb.unsubscribe();
    })
  }

  SignOut(){
    this.authService.signOut();
  }
}
