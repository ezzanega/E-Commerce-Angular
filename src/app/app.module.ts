import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { TruncatePipe } from './truncate/truncate.pipe';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { SideCartComponent } from './components/side-cart/side-cart.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductsComponent } from './pages/products/products.component';
import { AddProductComponent } from './pages/add-product/add-product.component';


import { DetailsProductComponent } from './pages/details-product/details-product.component';
import { LoginComponent } from './pages/Auth/login/login.component';
import { RegisterComponent } from './pages/Auth/register/register.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptorInterceptor } from './Interceptor/auth-interceptor.interceptor';
import { ConfirmationModalComponentComponent } from './components/shared/confirmation-modal-component/confirmation-modal-component.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';
import { AllOrdersComponent } from './pages/all-orders/all-orders.component';
import { DetailsOrderComponent } from './pages/details-order/details-order.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthserviceService } from './services/auth/authservice.service';
import { AuthguardGuard } from './guard/authguard.guard';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ShopComponent,
    SideCartComponent,
    CartComponent,
    WishlistComponent,
    AboutUsComponent,
    ContactUsComponent,
    MobileMenuComponent,
    ProductsComponent,
    AddProductComponent,
    TruncatePipe,
    DetailsProductComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmationModalComponentComponent,
    CheckoutComponent,
    OrderSuccessComponent,
    AllOrdersComponent,
    DetailsOrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
    }),
  ],
  providers: [
    AuthserviceService,
    AuthguardGuard,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },


  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
