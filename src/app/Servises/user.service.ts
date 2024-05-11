import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import {getFirestore} from 'firebase/firestore'

import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }
  getUsersById(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  createUser(user: any): Promise<any> {
    return this.firestore.collection('users').doc(user.uid).set(user);
  }
}
