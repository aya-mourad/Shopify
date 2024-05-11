import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: AngularFirestore) { }

  // Get all users
  getUsers() {
    return this.firestore.collection('users').valueChanges();
  }

  // Send message
  sendMessage(message: any) {
    return this.firestore.collection('messages').add(message);
  }

 
  // Get messages between two users
  getMessages(senderId: string, receiverId: string) {
    return this.firestore.collection('messages', ref =>
      ref.where('senderId', '==', senderId)
        .where('receiverId', '==', receiverId)
    ).valueChanges();
  }
}

































  