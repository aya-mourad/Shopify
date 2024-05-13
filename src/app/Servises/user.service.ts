import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import {getFirestore} from 'firebase/firestore'
import firebase from 'firebase/compat/app';
import { User as FirebaseUser } from 'firebase/auth';

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


  getCurrentUser(): Observable<FirebaseUser | null> {
    return new Observable((observer) => {
      firebase.auth().onAuthStateChanged((user) => {
        observer.next(user as FirebaseUser | null);
        observer.complete();
      });
    });
  }
}
