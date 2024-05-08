import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/Servises/products.service';
import { Products } from 'src/app/interfaces/products';
import { AngularFirestore} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  productId: string;
  productD: Observable<Products | undefined>;
  ratings$: Observable<any[]>;

  constructor(
    private _activated: ActivatedRoute,
    private details: ProductsService,
    private firestore: AngularFirestore
  ) {
    this.productId = this._activated.snapshot.params['productId'];
    this.productD = this.details.getProductById(this.productId);
    this.ratings$ = this.firestore.collection(`products/${this.productId}/ratings`).valueChanges();
  }

  submitRating(rating: number, feedback: string): void {
    this.firestore.collection(`products/${this.productId}/ratings`).add({
      rating: rating,
      feedback: feedback,
      timestamp: new Date()
    });
  }
}
