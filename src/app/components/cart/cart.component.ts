import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment.development';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  cart:Cart = {items :[
    {
      product:'https://via.placeholder.com/150',
      name:'snickers',
      price:150,
      quantity :2,
      id:1
    }
  ]}
  dataSource : Array<CartItem> = [];
  displayedColumns:Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ]
  constructor(private cartservice:CartService, private http:HttpClient,private _snackbar :MatSnackBar){}
 ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartservice.cart.subscribe((_cart:Cart)=>{
      this.cart  = _cart;
      this.dataSource = this.cart.items
    })
 }
getTotal(items:Array<CartItem>):number{
  return this.cartservice.getTotal(items);
}
onClearCart():void{
  this.cartservice.clearCart();
}
onRemoveFromCart(item:CartItem):void{
this.cartservice.removeFromCart(item);
}
onAddQuantity(item:CartItem):void{
  this.cartservice.addToCart(item)
}
onRemoveCart(item :CartItem):void{
  this.cartservice.removeQuantity(item)
}
onCheckout():void{
  this.http.post(environment.SERVER_URL,{
    items:this.cart.items
  }).subscribe(async(res:any) => {
    let stripe = await loadStripe(environment.STRIPE_PUBLIC_KEY);
    stripe?.redirectToCheckout({
      sessionId:res.id
    })
  },(err)=>{
    this._snackbar.open(err.error.message,'Ok',{duration: 3000});
  })
}
}
