import { Component } from '@angular/core';
import { ProductsService } from 'src/app/Servises/products.service';
import { Observable } from 'rxjs';
import { Products } from 'src/app/interfaces/products';


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  productObservable: Observable<{ id: string; data: Products; }[]>;
  constructor(private product:ProductsService){
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';
  this.productObservable= this.product.getProductsByUserIdFromWishlist(userIdAsString)
  // console.log(this.productObservable)
    this.productObservable.subscribe(products => {
      console.log('Products:', products);
    });
}

deleteFromWishlist(productId: string): void {
  this.product.removeFromWishlist(productId);
}
}
