import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable ,combineLatest} from 'rxjs';
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
  
  getUnsoldProducts(): Observable<any[]> {
    return this.afs.collection('product', ref => ref.where('isSold', '==', false)).valueChanges();
  }

 

  getProductById(productId: string): Observable<Products | undefined> {
    return this.afs.collection<Products>('product').doc(productId).valueChanges();
  }
  // getProductById(productId: string): Observable<{ sellerID?: string, product: Products | undefined }> {
  //   return new Observable(observer => {
  //     const productDoc = this.afs.collection<Products>('product').doc(productId);
  //     const productObs = productDoc.valueChanges();
  //     const sellerIDObs = productDoc.get().pipe(
  //       map(doc => {
  //         const data = doc.data();
  //         return data ? data.sellerId : undefined;
  //       })
  //     );

  //     combineLatest([productObs, sellerIDObs]).subscribe(([product, sellerID]) => {
  //       observer.next({ product, sellerID });
  //       observer.complete();
  //     }, error => {
  //       observer.error(error);
  //     });
  //   });
  // }
  addProducts(products : Products) {
    products.id = this.afs.createId();
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';
    products.sellerId = userIdAsString;
    return this.afs.collection('/product').add(products);
  }
  // async addProducts(products: Products): Promise<DocumentReference<unknown>> {
  //   try {
  //     products.id = this.afs.createId();
  //     const userId = localStorage.getItem('userId');
  //     const userIdAsString = userId ? userId.toString() : '';
  //     products.sellerId = userIdAsString;

  //     console.log('Adding product:', products);

  //     const docRef = await this.afs.collection('/product').add(products);
  //     console.log('Product added successfully with ID:', docRef.id);
  //     return docRef;
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //     throw error; // Rethrow the error to handle it in the caller
  //   }
  // }
  
 
  // getProductsByUserIdFromWishlist(userId: string): Observable<Products[]> {
  //   return this.afs.collection('wishlist', ref => ref.where('userId', '==', userId)).valueChanges().pipe(
  //     switchMap((wishlistItems: any[]) => {
  //       const productObservables = wishlistItems.map(item =>
  //         this.afs.doc<Products>(`product/${item.productId}`).valueChanges().pipe(
  //           // Map the product data to an object containing both the ID and the data
  //           map(data => ({  data: data! })) // Non-null assertion operator (!)
  //         )
  //       );
  //       return combineLatest(productObservables);
  //     })
  //   );
  // }

  getProductsByUserIdFromWishlist(userId: string): Observable<Products[]> {
    return this.afs.collection('wishlist', ref => ref.where('userId', '==', userId)).valueChanges().pipe(
      map(wishlistItems => wishlistItems.map((item: any) => item.productId)),
      switchMap(productIds => {
        const productObservables = productIds.map(id =>
          this.afs.doc<Products>(`product/${id}`).valueChanges()
        );
        return combineLatest(productObservables).pipe(
          map(products => products.filter(product => !!product) as Products[])
        );
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
    const query = this.afs.collection('wishlist', ref => 
      ref.where('userId', '==', userId)
         .where('productId', '==', productId)
         .limit(1)
    );
    query.get().subscribe((querySnapshot) => {
      if (querySnapshot.size === 1) {
        const docId = querySnapshot.docs[0].id;
  
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
