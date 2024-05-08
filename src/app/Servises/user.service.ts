import { Injectable } from '@angular/core';
// import {getFirestore} from 'firebase/firestore'

import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  createUser(user: any): Promise<any> {
    return this.firestore.collection('users').doc(user.uid).set(user);
  }
}
