import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import {
  Firestore,
  addDoc,
  collection,
  CollectionReference,
} from 'firebase/firestore';
import { collectionData } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Products } from '../interfaces/products';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient, private afs: AngularFirestore) {}
  getAllProducts(): Observable<Products[]> {
    const productCollection: AngularFirestoreCollection<Products> =
      this.afs.collection<Products>('product');
    return productCollection.valueChanges({ idField: 'id' });
  }

  getProductById(productId: string): Observable<Products | undefined> {
    return this.afs
      .collection<Products>('product')
      .doc(productId)
      .valueChanges();
  }

  addProducts(products: Products) {
    products.id = this.afs.createId();
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';
    products.sellerId = userIdAsString;
    return this.afs.collection('/product').add(products);
  }

  getProductsByUserIdFromWishlist(userId: string): Observable<Products[]> {
    return this.afs
      .collection('wishlist', (ref) => ref.where('userId', '==', userId))
      .valueChanges()
      .pipe(
        map((wishlistItems) =>
          wishlistItems.map((item: any) => item.productId)
        ),
        switchMap((productIds) => {
          const productObservables = productIds.map((id) =>
            this.afs.doc<Products>(`product/${id}`).valueChanges()
          );
          return combineLatest(productObservables).pipe(
            map(
              (products) =>
                products.filter(
                  (product) => !!product && !product.isSold
                ) as Products[]
            )
          );
        })
      );
  }

  addToWishlist(productId: string): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const wishlistItem = {
        userId: userId,
        productId: productId,
      };
      this.afs
        .collection('wishlist')
        .add(wishlistItem)
        .then(() => {
          console.log('Wishlist item added successfully!');
        })
        .catch((error) => {
          console.error('Error adding wishlist item: ', error);
        });
    } else {
      console.error('User ID not found in local storage.');
    }
  }

  removeFromWishlist(productId: string): void {
    const userId = localStorage.getItem('userId');
    const query = this.afs.collection('wishlist', (ref) =>
      ref
        .where('userId', '==', userId)
        .where('productId', '==', productId)
        .limit(1)
    );
    query.get().subscribe((querySnapshot) => {
      if (querySnapshot.size === 1) {
        const docId = querySnapshot.docs[0].id;

        this.afs
          .collection('wishlist')
          .doc(docId)
          .delete()
          .then(() => {
            console.log('Wishlist item removed successfully!');
          })
          .catch((error) => {
            console.error('Error removing wishlist item: ', error);
          });
      } else {
        console.error('Wishlist item not found.');
      }
    });
  }
  getUnsoldProducts(): Observable<any[]> {
    return this.afs
      .collection('product', (ref) => ref.where('isSold', '==', false))
      .valueChanges();
  }
}
