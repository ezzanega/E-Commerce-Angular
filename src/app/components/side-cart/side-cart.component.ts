import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/auth/authservice.service';
import { CartService } from 'src/app/services/cartService/cart.service';

@Component({
  selector: 'app-side-cart',
  templateUrl: './side-cart.component.html',
  styleUrls: ['./side-cart.component.css']
})
export class SideCartComponent implements OnInit {

  cartVisible = false;

  cartItems: any[] = [];


  constructor(private cartService: CartService, private authService: AuthserviceService , private router :Router) {}

  ngOnInit(): void {
    this.cartService.cartVisible$.subscribe(visible => {
      this.cartVisible = visible;
    });

    this.cartService.loadCart();

    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      console.log('Cart items', items);
    });
  }

  // loadCart(): void {
  //   const userId = this.authService.getUserId();
  //   this.cartService.getCartItems().subscribe(
  //     (data:any) => {
  //       this.cartItems = data;
  //       console.log('Cart items', data);
  //     },
  //     (error:any) => {
  //       console.error('Error fetching cart items', error);
  //     }
  //   );
  // }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe(
      response => {
        console.log('Product removed from cart', response);
        this.cartService.fetchCartItemCount(); // Fetch the updated cart item count
       // this.loadCart(); // Refresh cart items
        this.cartService.loadCart();

      },
      error => {
        console.error('Error removing from cart', error);
      }
    );
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.product.prix * item.quantity, 0);
  }


  closeCart() {
    this.cartService.toggleCart();
  }

  GoToCartPage() {
    this.router.navigate(['/cart']);
    this.closeCart();
  }

  GoTochekoutPage() {
    this.router.navigate(['/checkout']);
    this.cartService.toggleCart();
  }

}
