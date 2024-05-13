import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(private firestore: AngularFirestore) { }

  sendMessage(chatId: string, message: { text: string,senderId: string; receiverId:string, timestamp: Date }) {
    return this.firestore.collection('chats').doc(chatId).collection('messages').add(message);
  }
 
  getMessages(chatId: string): Observable<any[]> {
    return this.firestore.collection(`chats/${chatId}/messages`, ref => ref.orderBy('timestamp', 'asc'))
      .valueChanges({ idField: 'docId' });
  }

  /*listenForNewMessages(chatId: string, callback: (messages: any) => void): void {
    this.firestore.collection(`chats/${chatId}/messages`, ref => ref.orderBy('timestamp', 'asc'))
      .stateChanges(['added'])
      .subscribe(actions => {
        actions.forEach(action => {
          if (action.type === 'added') {
            callback(action.payload.doc.data());
          }
        });
      });
  }*/
}