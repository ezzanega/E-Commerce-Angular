import { CartService } from 'src/app/services/cartService/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private CartService:CartService) { }
  ngOnInit(): void {
    this.CartService.loadCart();
    this.CartService.fetchCartItemCount();
  }
}
