import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthserviceService } from '../auth/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemCount = new BehaviorSubject<number>(0);
  private cartItems = new BehaviorSubject<any[]>([]);

  private cartVisibleSubject = new BehaviorSubject<boolean>(false);
  cartVisible$ = this.cartVisibleSubject.asObservable();

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,private authService: AuthserviceService) {

  }


  toggleCart() {
    this.cartVisibleSubject.next(!this.cartVisibleSubject.value);
  }


  addToCart(user_id:number , productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-to-cart`, {user_id , product_id: productId, quantity });
  }

  // loadCart(){
  //   const userId = this.authService.getUserId();
  //   this.http.get<any[]>(`${this.apiUrl}/cart`, { params: { user_id: userId } }).subscribe(
  //     cartItems => {
  //       this.cartItems.next(cartItems);
  //       this.cartItemCount.next(cartItems.length);
  //     },
  //     error => {
  //       console.error('Error loading cart items', error);
  //     }
  //   );
  // }



  loadCart(): void {
    const userId = this.authService.getUserId();
    this.http.get<{ count: number }>(`${this.apiUrl}/cart`, { params: { user_id: userId } })
      .subscribe((response:any) => {
        this.cartItems.next(response);
      }),
      (error:any) => {
        console.error('Error loading cart items', error);
      }
  }


  getCartItems(): Observable<any[]> {
    return this.cartItems.asObservable();
  }


  removeFromCart(productId: number): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.delete(`${this.apiUrl}/cart`, { body: { product_id: productId, user_id: userId } });
  }



  getCartItemCount(): Observable<number> {
    return this.cartItemCount.asObservable();
  }


  fetchCartItemCount(): void {
    const userId = this.authService.getUserId();
    this.http.get<{ count: number }>(`${this.apiUrl}/cart/item-count`, { params: { user_id: userId } })
      .subscribe(response => {
        this.cartItemCount.next(response.count);
      });
  }

  clearCartData(): void {
    this.cartItems.next([]);
    this.cartItemCount.next(0);
  }

  clearCart(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.delete(`${this.apiUrl}/cart/clear`, { body: { user_id: userId } });
  }

  updateCartItemQuantity(productId: number, quantity: number): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.put(`${this.apiUrl}/cart/update-quantity`, { product_id: productId, quantity, user_id: userId });
  }


}
