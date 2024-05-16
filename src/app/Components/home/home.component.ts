import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../Servises/products.service';
import { Products } from 'src/app/interfaces/products';
import { Observable, of } from 'rxjs';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  searchValue: string = '';
  wishlistItems: any[] = [];
  productObservable: Observable<Products[]>;
  wishlistObservable: Observable<Products[]>;
  //  private wishclear: Subscription;
  constructor(private products: ProductsService) {
    this.productObservable = this.products.getUnsoldProducts();

    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';

    this.wishlistObservable =
      this.products.getProductsByUserIdFromWishlist(userIdAsString);
    this.wishlistObservable.subscribe((wishlistItems) => {
      this.wishlistItems = wishlistItems;
      console.log(this.wishlistItems);
    });
  }

  addToWishlist(productId: string): void {
    this.products.addToWishlist(productId);
  }

  isProductInWishlist(productId: string): boolean {
    return this.wishlistItems.some((item) => item.id === productId);
  }

  toggleWishlist(productId: string): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const isInWishlist = this.isProductInWishlist(productId);
      if (isInWishlist) {
        // Remove product from wishlist
        this.products.removeFromWishlist(productId);
      } else {
        // Add product to wishlist
        this.products.addToWishlist(productId);
      }
    } else {
      // Handle case where userId is not available (e.g., user not logged in)
      console.log('User not logged in');
    }
  }
}
