import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponentComponent } from 'src/app/components/shared/confirmation-modal-component/confirmation-modal-component.component';
import { AuthserviceService } from 'src/app/services/auth/authservice.service';
import { CartService } from 'src/app/services/cartService/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  SuccessCartMessage: string | null = '';
  @ViewChild('clearCartModal') clearCartModal: ElementRef | undefined;

  constructor( private toastr: ToastrService , private cartService: CartService,
    private authService: AuthserviceService , private modalService: NgbModal , private router:Router) {}

  ngOnInit(): void {
    this.loadCart();
  }


  loadCart(): void {
    // const userId = this.authService.getUserId();
    this.cartService.getCartItems().subscribe(
      data => {
        this.cartItems = data;
        console.log('Cart items', data);
      },
      error => {
        console.error('Error fetching cart items', error);
      }
    );
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe(
      response => {
        console.log('Product removed from cart', response);
        this.cartService.fetchCartItemCount();
        this.cartService.loadCart();
        this.SuccessCartMessage = 'Product removed from cart';

      },
      error => {
        console.error('Error removing from cart', error);
      }
    );
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.product.prix * item.quantity, 0);
  }


  incrementQuantity(productId: number): void {
    const item = this.cartItems.find(cartItem => cartItem.product.id === productId);
    if (item) {
      this.cartService.updateCartItemQuantity(productId, item.quantity + 1).subscribe(() => {
        item.quantity += 1;
        this.cartService.loadCart();
      });
    }
  }

  decrementQuantity(productId: number): void {
    const item = this.cartItems.find(cartItem => cartItem.product.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateCartItemQuantity(productId, item.quantity - 1).subscribe(() => {
        item.quantity -= 1;
        this.cartService.loadCart();
      });
    }
  }

  openClearCartModal(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponentComponent);
    modalRef.componentInstance.message = 'Are you sure you want to clear the cart?';

    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.confirmClearCart();
        }
      },
      (reason) => {
        // Handle dismissal reason if needed
      }
    );
  }

  confirmClearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.cartService.clearCartData();
      this.toastr.success('Cart cleared successfully!');
      // this.SuccessCartMessage = 'Cart cleared successfully!';
    });
  }


  GoTochekoutPage() {
    this.router.navigate(['/checkout']);
  }





}
