import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ProductsComponent } from './pages/products/products.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { DetailsProductComponent } from './pages/details-product/details-product.component';
import { LoginComponent } from './pages/Auth/login/login.component';
import { AuthguardGuard } from './guard/authguard.guard';
import { LoginGuard } from './guard/login.guard';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';
import { AllOrdersComponent } from './pages/all-orders/all-orders.component';
import { DetailsOrderComponent } from './pages/details-order/details-order.component';




const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent ,  canActivate: [LoginGuard] },

  { path: 'shop', component: ShopComponent},
  { path: 'cart', component: CartComponent , canActivate: [AuthguardGuard] },
  { path: 'wishlist', component: WishlistComponent  , canActivate: [AuthguardGuard]},
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'all-products', component: ProductsComponent },
  { path: 'add-product', component: AddProductComponent },
  // { path: 'details', component: DetailsProductComponent },
  { path: 'details/:id', component: DetailsProductComponent },
  { path: 'checkout', component: CheckoutComponent , canActivate: [AuthguardGuard]},
  { path: 'order-success', component: OrderSuccessComponent , canActivate: [AuthguardGuard]},
  { path: 'orders', component: AllOrdersComponent},
  { path: 'order/détails', component: DetailsOrderComponent},

  // { path: '', redirectTo: '/login', pathMatch: 'full' }
  // Add more routes here as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
