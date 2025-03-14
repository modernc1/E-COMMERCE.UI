import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products/products-list/products-list.component';

import { CategoriesListComponent } from './components/categories/categories-list/categories-list.component';
import { HomePageComponent } from './components/core/home-page/home-page.component';
import { CreateProductItemComponent } from './components/products/create-product-item/create-product-item.component';
import { ShoesListComponent } from './components/store/shoes-list/shoes-list.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart/cart.component';
import { CheckoutComponent } from './components/cart/checkout/checkout.component';
import { CheckoutResultComponent } from './components/cart/checkout-result/checkout-result.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard } from './components/auth/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },

  // Admin Routes
  {
    path: 'admin', canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'users-management', pathMatch: 'full' },
      { path: 'products', component: ProductsListComponent },
      { path: 'products/create-product', component: CreateProductItemComponent },
      { path: 'categories', component: CategoriesListComponent },
    ]
  },

  // User Management
  {path: 'auth',
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent},

    ]
  },

  // Product Routes
  { path: 'shoes-list', component: ShoesListComponent },
  { path: 'product-details/:id', component: ProductDetailComponent },

  // Cart Routes
  {
    path: 'cart',
    children: [
      { path: '', component: CartComponent, canActivate: [authGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard]},
      { path: 'checkoutResult', component: CheckoutResultComponent, canActivate: [authGuard]}
    ]
  }
];
