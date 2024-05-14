import { Injectable } from '@angular/core';
// import {getFirestore} from 'firebase/firestore'
import { combineLatest, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Products } from '../interfaces/products';
import { ProductWithFeedbackRating } from '../interfaces/ProductWithFeedbackRating.ts';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  createUser(user: any): Promise<any> {
    return this.firestore.collection('users').doc(user.uid).set(user);
  }
}
  // createUser(user: any): Promise<any> {
  //   return this.firestore.collection('users').doc(user.uid).set(user);
  // }



  getUserById(): Observable<any> {
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';
    return this.afs.doc<any>(`users/${userIdAsString}`).valueChanges();
  }

  getProductsByUserId(): Observable<ProductWithFeedbackRating[]> {
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';

    return this.afs.collection<Products>('product', ref =>
      ref.where('sellerId', '==', userIdAsString)
    ).snapshotChanges().pipe( // Use snapshotChanges() instead of valueChanges()
      switchMap(products => {
        const observables: Observable<ProductWithFeedbackRating>[] = products.map(product => {
          const productId = product.payload.doc.id; // Get the document ID
          const prating = this.afs.collection(`products/${productId}/ratings`).valueChanges();
          const pfeedback = this.afs.collection(`products/${productId}/feedbacks`).valueChanges();
          return combineLatest([pfeedback, prating]).pipe(
            map(([feedbacks, ratings]) => ({
              productId: productId, 
              feedback: feedbacks,
              rating: ratings,
              sellerId: product.payload.doc.data().sellerId, 
              categoryName: product.payload.doc.data().categoryName,
              description: product.payload.doc.data().description,
              price: product.payload.doc.data().price,
              title: product.payload.doc.data().title,
              imageCover: product.payload.doc.data().imageCover,
              location: product.payload.doc.data().location
            } as ProductWithFeedbackRating))
          );
        });
        return combineLatest(observables);
      })
    );
}

  removeProduct(productId: string) {
    return this.afs.collection('product').doc(productId).delete();
  }

  async updateIsSold(productId: string): Promise<void> {
    try {
      await this.afs.collection('product').doc(productId).update({ isSold: true });
      console.log('Product marked as sold successfully');
    } catch (error) {
      console.error('Error marking product as sold:', error);
      throw error; 
    }
  }
}
