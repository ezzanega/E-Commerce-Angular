import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthserviceService } from 'src/app/services/auth/authservice.service';
import { CartService } from 'src/app/services/cartService/cart.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  orderData: any = {
    user_id: null,
    total_amount: 0,
    items: [],
    product :{
      nom: '',
    },
    billing: {
      first_name: '',
      last_name: '',
      address: '',
      city: '',
      state: '',
      postcode: '',
      country: 'Morocco',
      phone: '',
      email: ''
    },

  };
  // orderData: any
   constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthserviceService,
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(cartItems => {
      this.orderData.items = cartItems.map(item => ({
        product_id: item.product.id,
        product_nom: item.product.nom,
        product_prix: item.product.prix,
        product_image: item.product.image_initiale,
        product_description: item.product.description,
        quantity: item.quantity,
        price: item.product.prix
      }));
      this.orderData.total_amount = this.orderData.items.reduce((total:any, item:any) => total + item.price * item.quantity, 0);
    });
  }

  placeOrder(): void {
    this.orderData.user_id = this.authService.getUserId();
    this.orderService.placeOrder(this.orderData).subscribe(
      response => {
        this.toastr.success('Order placed successfully', 'Success');
        this.cartService.fetchCartItemCount();
        this.cartService.loadCart();
        this.router.navigate(['/order-success']);
      },
      error => {
        this.toastr.error('Failed to place order', 'Error');
        console.error('Order placement error:', error);
      }
    );
  }


}
