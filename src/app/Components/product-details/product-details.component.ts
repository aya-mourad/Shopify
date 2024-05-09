import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/Servises/products.service';
import { Products } from 'src/app/interfaces/products';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  productId: string;
  productD: Observable<Products | undefined>;
  ratings$: Observable<any[]>;
  feedbacks$: Observable<any[]>;
  userId: string ; // Add a property to store the user ID
  userName: string | undefined; // Add a property to store the user name

  constructor(
    private _activated: ActivatedRoute,
    private details: ProductsService,
    private firestore: AngularFirestore
  ) {
    this.productId = this._activated.snapshot.params['productId'];
    this.productD = this.details.getProductById(this.productId);
    this.ratings$ = this.firestore.collection(`products/${this.productId}/ratings`).valueChanges();
    this.feedbacks$ = this.firestore.collection(`products/${this.productId}/feedbacks`).valueChanges();

    // Retrieve user ID and name from local storage or authentication service
    this.userId = localStorage.getItem('userId')!;
    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe((user: any) => {
      this.userName = user.name; // Assuming you have a 'name' field in your user document
    });
  }

  submitRating(rating: number, feedback: string): void {
    // Add user ID and name to ratings and feedbacks
    this.firestore.collection(`products/${this.productId}/ratings`).add({
      userId: this.userId,
      userName: this.userName,
      rating: rating,
      timestamp: new Date()
    });
    this.firestore.collection(`products/${this.productId}/feedbacks`).add({
      userId: this.userId,
      userName: this.userName,
      feedback: feedback,
      timestamp: new Date()
    });
  }
}
