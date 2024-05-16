import { Feedback } from './../interfaces/Feedback';
import { Injectable } from '@angular/core';
// import {getFirestore} from 'firebase/firestore'
import { combineLatest, Observable, from } from 'rxjs';
import { first } from 'rxjs/operators';
import { switchMap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Products } from '../interfaces/products';
import { ProductWithFeedbackRating } from '../interfaces/ProductWithFeedbackRating';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private afs: AngularFirestore) {}

  createUser(user: any): Promise<any> {
    return this.afs.collection('users').doc(user.uid).set(user);
  }

  // createUser(user: any): Promise<any> {
  //   return this.firestore.collection('users').doc(user.uid).set(user);
  // }

  getUsersById(userId: string): Observable<any> {
    return this.afs.collection('users').doc(userId).valueChanges();
  }

  // getUserNameById(userId: string): Observable<string | undefined> {
  //   return this.afs.collection('users').doc(userId).valueChanges().pipe(
  //     map((user: any) => user ? user.username : undefined)
  //   );
  // }

  getUsernameById(userId: string): Promise<string> {
    return this.afs
      .collection('users')
      .doc(userId)
      .valueChanges()
      .pipe(
        first(),
        map((user: any) => user?.name || '')
      )
      .toPromise();
  }
  getCurrentUser(): Observable<any> {
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';
    return this.afs.doc<any>(`users/${userIdAsString}`).valueChanges();
  }

  getProductsByUserId(): Observable<ProductWithFeedbackRating[]> {
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';

    return this.afs
      .collection<Products>('product', (ref) =>
        ref.where('sellerId', '==', userIdAsString)
      )
      .snapshotChanges()
      .pipe(
        // Use snapshotChanges() instead of valueChanges()
        switchMap((products) => {
          const observables: Observable<ProductWithFeedbackRating>[] =
            products.map((product) => {
              const productId = product.payload.doc.id; // Get the document ID
              const prating = this.afs
                .collection(`products/${productId}/ratings`)
                .valueChanges();
              const pfeedback = this.afs
                .collection(`products/${productId}/feedbacks`)
                .valueChanges();
              return combineLatest([pfeedback, prating]).pipe(
                map(
                  ([feedbacks, ratings]) =>
                    ({
                      productId: productId,
                      feedback: feedbacks,
                      ratings: ratings,
                      sellerId: product.payload.doc.data().sellerId,
                      categoryName: product.payload.doc.data().categoryName,
                      description: product.payload.doc.data().description,
                      price: product.payload.doc.data().price,
                      title: product.payload.doc.data().title,
                      imageCover: product.payload.doc.data().imageCover,
                      location: product.payload.doc.data().location,
                    } as ProductWithFeedbackRating)
                )
              );
            });
          return combineLatest(observables);
        })
      );
  }

  removeProduct(productId: string) {
    return this.afs.collection('product').doc(productId).delete();
  }
  //   async createChatNotification(productId: string) {
  //     try {
  //       console.log('in create wishlist notify');

  //       // Query the wishlist collection to get documents where productId matches
  //       const wishlistSnapshot = await this.afs.collection('wishlist', ref => ref.where('productId', '==', productId)).get();

  //       // Extract the data from each document and create notifications
  //       const notifications = wishlistSnapshot.docs.map(wishlistDoc => {
  //         const data = wishlistDoc.data(); // Extract data from the document snapshot
  //         const notifiedUserId = data.userId; // Get the user ID from the extracted data

  //         // Construct the notification object
  //         const notification = {
  //           senderId: notifiedUserId,
  //           notifiedUserId,
  //           senderUserName: '', // You need to define how to get the sender's username
  //           text: 'product is sold ', // You can customize this message
  //           timestamp: new Date(),
  //         };

  //       // Add all notifications to the notifications collection in a batch
  //       const batch = this.afs.firestore.batch();
  //       notifications.forEach(notification => {
  //         const newNotificationRef = this.afs.collection('notifications').doc();
  //         batch.set(newNotificationRef, notification);
  //       });
  //       await batch.commit();

  //       console.log('Notifications added successfully.');
  //     } catch (error) {
  //       console.error('Error adding notifications: ', error);
  //     }
  //   }
  async updateIsSold(productId: string): Promise<void> {
    try {
      await this.afs
        .collection('product')
        .doc(productId)
        .update({ isSold: true });
      console.log('Product marked as sold successfully');
    } catch (error) {
      console.error('Error marking product as sold:', error);
      throw error;
    }
  }
}
