import { Component, OnInit } from '@angular/core';
import { Cart } from './models/cart.model';
import { CartService } from './services/cart.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ecommerce';
  cart:Cart = { items:[]}

  constructor(private cartservice : CartService){}
  ngOnInit(): void {
      this.cartservice.cart.subscribe((_cart) =>{
        this.cart = _cart;
      })

  }
}
