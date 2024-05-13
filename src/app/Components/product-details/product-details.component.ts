import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/Servises/products.service';
import { Products } from 'src/app/interfaces/products';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserService } from './../../Servises/user.service';
import { user } from 'src/app/interfaces/user';
import { of } from 'rxjs';

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
  userId: string | undefined ; // Add a property to store the user ID
  userName: string | undefined; // Add a property to store the user name
  seller: Observable<user | undefined> = of(undefined); // Initialize seller with undefined
  
  constructor(
    private _activated: ActivatedRoute,
    private details: ProductsService,
    private firestore: AngularFirestore ,
    private router: Router , 
    private users : UserService,
  ) {
    this.productId = this._activated.snapshot.params['productId'];
    this.productD = this.details.getProductById(this.productId);
    this.ratings$ = this.firestore.collection(`products/${this.productId}/ratings`).valueChanges();
    this.feedbacks$ = this.firestore.collection(`products/${this.productId}/feedbacks`).valueChanges();
    //this.seller= this.users.getUsersById(this.firestore.collection(`products/${this.productId}/sellerId`).valueChanges());
    //this.seller= this.users.getUsersById(this.productD.sellerId);

    // Retrieve user ID and name from local storage or authentication service
    const userId = localStorage.getItem('userId');
    this.userId = userId ? userId.toString() : '';
    
    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe((user: any) => {
      if (user) {
        this.userName = user.name; // Assuming you have a 'name' field in your user document
      }
      else
        this.userName = '';
    });
  }



  ngOnInit() {
    this.productD.subscribe((product: Products | undefined) => {
      if (product) {
        const sellerID = product?.sellerId; // Access sellerId property safely
        if (sellerID) {
          this.seller = this.users.getUsersById(sellerID);
        }
      }
    });
  }


  redirectToChat(user: any): void {
    this.router.navigate(['/messages' , user.uid]);
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
