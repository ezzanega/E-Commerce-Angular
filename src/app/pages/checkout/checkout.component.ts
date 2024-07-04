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
      email: '',
      note: '',
    },

  };
  villes: any[] = [];
  errorMessage:string=''

  // orderData: any
   constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthserviceService,
  ) {}

  ngOnInit(): void {
    this.loadUserInformation();
    this.loadCartItems();
    this.fetchVilles();
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

  loadUserInformation(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getUserById(userId).subscribe(
        userInfo => {
          this.orderData.billing.first_name = userInfo.first_name || '';
          this.orderData.billing.last_name = userInfo.last_name || '';
          this.orderData.billing.country = 'Morocco';
          this.orderData.billing.city = userInfo.city || null;
          this.orderData.billing.address = userInfo.address || '';
          this.orderData.billing.postcode = userInfo.postcode || '';
          this.orderData.billing.phone = userInfo.phone || '';
          this.orderData.billing.email = userInfo.email || '';
        },
        error => {
          this.toastr.error('Failed to load user information', 'Error');
          console.error('User information loading error:', error);
        }
      );
    }
  }


  validateUserInformation(): boolean {
    const billing = this.orderData.billing;
    if (!billing.first_name || !billing.last_name || !billing.city || !billing.address || !billing.postcode || !billing.phone || !billing.email) {
      this.errorMessage='Please complete all required fields'
      this.toastr.warning('Please complete all required fields', 'Validation');
      return false;
    }
    return true;
  }

  fetchVilles(): void {
    this.orderService.getAllVilles().subscribe(
      (data) => {
        this.villes = data;
      },
      (error) => {
        console.error('Error fetching cities', error);
      }
    );
  }

  updateUserInformation(callback: () => void): void {
    const userId = this.authService.getUserId();
    const billing = this.orderData.billing;
    this.authService.updateUser(userId, billing).subscribe(
      response => {
        this.toastr.success('User information updated successfully', 'Success');
        callback();
      },
      error => {
        this.toastr.error('Failed to update user information', 'Error');
        console.error('User information update error:', error);
      }
    );
  }

  placeOrder(): void {
    this.errorMessage=''
    if (this.validateUserInformation()) {
      this.updateUserInformation(() => {
        this.orderData.user_id = this.authService.getUserId();
        this.orderService.placeOrder(this.orderData).subscribe(
          response => {
            this.toastr.success('Order placed successfully', 'Success');
            this.cartService.fetchCartItemCount();
            this.cartService.loadCart();
            this.router.navigate(['/order-success']);
          },
          error => {
            this.errorMessage='Failed to place order';
            this.toastr.error('Failed to place order', 'Error');
            console.error('Order placement error:', error);
          }
        );
      });
    }
}

}
