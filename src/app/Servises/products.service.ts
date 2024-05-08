import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable ,combineLatest} from 'rxjs';
import { Firestore, addDoc, collection ,CollectionReference} from 'firebase/firestore';
import { collectionData } from '@angular/fire/firestore'
import { map,switchMap } from 'rxjs/operators';
import { Products } from '../interfaces/products';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient, private afs: AngularFirestore) { }
  getAllProducts(): Observable<Products[]> {
    const productCollection: AngularFirestoreCollection<Products> = this.afs.collection<Products>('product');
    return productCollection.valueChanges({ idField: 'id' });
  }

  getProductById(productId: string): Observable<Products | undefined> {
    return this.afs.collection<Products>('product').doc(productId).valueChanges();
  }
  addProducts(products : Products) {
    products.id = this.afs.createId();
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';
    products.sellerId = userIdAsString;
    return this.afs.collection('/product').add(products);
  }

 
  getProductsByUserIdFromWishlist(userId: string): Observable<{ id: string, data: Products }[]> {
    return this.afs.collection('wishlist', ref => ref.where('userId', '==', userId)).valueChanges().pipe(
      switchMap((wishlistItems: any[]) => {
        const productObservables = wishlistItems.map(item =>
          this.afs.doc<Products>(`product/${item.productId}`).valueChanges().pipe(
            // Map the product data to an object containing both the ID and the data
            map(data => ({ id: item.productId, data: data! })) // Non-null assertion operator (!)
          )
        );
        return combineLatest(productObservables);
      })
    );
  }

  addToWishlist(productId: string): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const wishlistItem = {
        userId: userId,
        productId: productId
      };
      this.afs.collection('wishlist').add(wishlistItem)
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

  removeFromWishlist( productId: string): void {
    const userId = localStorage.getItem('userId');
    // Construct a query to find the document with matching user ID and product ID
    const query = this.afs.collection('wishlist', ref => 
      ref.where('userId', '==', userId)
         .where('productId', '==', productId)
         .limit(1) // Assuming there's only one matching document
    );
    // Execute the query and get the corresponding document
    query.get().subscribe((querySnapshot) => {
      if (querySnapshot.size === 1) {
        // Get the document ID
        const docId = querySnapshot.docs[0].id;
  
        // Delete the document
        this.afs.collection('wishlist').doc(docId).delete()
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

  // that is working too!!!!
  // getAllProducts(): Observable<any[]> { // Assuming the return type is an array of objects
  //   return this.afs.collection('/product').snapshotChanges().pipe(
  //     map(actions => 
  //       actions.map(action => {
  //         const id = action.payload.doc.id;
  //         const data = action.payload.doc.data() as any; // or 'as object'
  //         return { id, ...data } as any; // Use 'as any' to satisfy TypeScript
  //       })
  //     )
  //   );
  // }
  
  // getAllProducts(): Observable<Products[]> {
  //   const productCollection = collection(this.fs, 'product');
  //   const products = collectionData(productCollection, { idField: 'id' }) as Observable<Products[]>;
  //   return products;
  // }
  // const productcollection=collection(this.fs,'product')
  //     const products = collectionData(productcollection,{idField:'id'})
  //     return products as Observable<Product[]>
  // return this.afs.collection('/product').snapshotChanges();


}
