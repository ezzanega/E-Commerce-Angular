import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthserviceService } from 'src/app/services/auth/authservice.service';
import { CartService } from 'src/app/services/cartService/cart.service';
import { MenuService } from 'src/app/services/menuService/menu.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userId  : number | null = null;
  UserData: any | undefined = undefined;
   isAuthenticated = false;

  private authListenerSubs: Subscription = new Subscription();
  cartItemCount: number = 0;



  constructor(
    private cartService: CartService,
    private menuService: MenuService,
    private authService: AuthserviceService,
    private router: Router
  ) {
    this.userId = this.authService.getUserId();
  }

  onCartButtonClick() {
    this.cartService.toggleCart();
  }
  onMenuButtonClick() {
    this.menuService.toggleMenu();
  }
  ngOnInit(): void {
    this.getUserById();



    this.isAuthenticated = this.authService.isAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });
      this.cartService.fetchCartItemCount();

      this.cartService.getCartItemCount().subscribe(count => {
        this.cartItemCount = count;
      });



  }

  logout() {
    this.authService.logout();
    this.cartService.clearCartData();
    this.router.navigate(['login']);
    this.userId = null;
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  getUserById() {
    if (!this.userId) return;
    this.authService.getUserById(this.userId).subscribe((data:any) => {
      this.UserData = data;
    });
  }
}
