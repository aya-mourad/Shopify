import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private firestore: AngularFirestore) {}

  getItemsByName(itemName: string): Observable<any[]> {
    return this.firestore
      .collection('product', (ref) => ref.where('title', '==', itemName))
      .valueChanges();
  }

  getItemsByCategory(category: string): Observable<any[]> {
    return this.firestore
      .collection('product', (ref) => ref.where('categoryName', '==', category))
      .valueChanges();
  }

  getItemsByLocation(location: string): Observable<any[]> {
    return this.firestore
      .collection('product', (ref) => ref.where('location', '==', location))
      .valueChanges();
  }

  getItemsByPriceRange(minPrice: number, maxPrice: number): Observable<any[]> {
    return this.firestore
      .collection('product', (ref) =>
        ref.where('price', '>=', minPrice).where('price', '<=', maxPrice)
      )
      .valueChanges();
  }
}
