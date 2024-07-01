import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/Models/product.model';
import { AuthserviceService } from 'src/app/services/auth/authservice.service';
import { CartService } from 'src/app/services/cartService/cart.service';
import { ProductService } from 'src/app/services/products/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {

  userId: number | null = null;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthserviceService,
    private router: Router,
    private toastr :ToastrService
  ) {
    this.userId = this.authService.getUserId();
  }

  products: Product[] = [];
  errorMessage: string = '';
  addedProductMessage: string = '';
  currentPage: number = 1;
  totalPages: any;
  totalProducts: any;
  itemsPerPage: number = 10;

  quantity: number |null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 1): void {
    this.productService.getProducts(page).subscribe(
      (data) => {
        this.products = data.data;
        this.totalPages = data.last_page;
        this.currentPage = data.current_page;
        this.totalProducts = data.total;
      },
      (error) => {
        this.errorMessage = error;
        console.error('Error fetching products', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.loadProducts(page);
  }

  getDiscountPercentage(oldPrice: number, newPrice: number): number {
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  }
  getShowingRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(
      this.currentPage * this.itemsPerPage,
      this.totalProducts
    );
    return `Showing ${start}–${end} of ${this.totalProducts} results`;
  }

  addToCart(productId: number , quantity :number): void {
    this.addedProductMessage = '';
    if (!this.authService.isAuthenticated() || !this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(this.userId , productId, quantity).subscribe(
      (response) => {
        this.cartService.fetchCartItemCount();
        this.cartService.loadCart();
        this.toastr.success('Product added to cart !' );
        // this.addedProductMessage = 'Product added to cart';
      },
      (error) => {
        console.error('Error adding to cart', error);
      }
    );
  }


}
