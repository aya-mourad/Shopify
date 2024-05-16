import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  currentusername: string = '';
  constructor(
    private firestore: AngularFirestore,
    private userService: UserService
  ) {}

  sendMessage(
    chatId: string,
    message: {
      text: string;
      senderId: string;
      receiverId: string;
      timestamp: Date;
    }
  ) {
    return this.firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(message);
  }

  getMessages(chatId: string): Observable<any[]> {
    return this.firestore
      .collection(`chats/${chatId}/messages`, (ref) =>
        ref.orderBy('timestamp', 'asc')
      )
      .valueChanges({ idField: 'docId' });
  }

  getUserNotifications(): Observable<any[]> {
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';
    console.log(userIdAsString);
    return this.firestore
      .collection('notifications', (ref) =>
        ref.where('notifiedUserId', '==', userIdAsString)
      )
      .valueChanges();
  }

  // // Notify a list of users with a message
  // async notifyUsers(userUids: string[], message: string) {
  //   try {
  //     const notifications = userUids.map((uid) => ({
  //       currentUserId: uid,
  //       text: message,
  //       timestamp: new Date()
  //     }));
  //     for (const notification of notifications) {
  //       await this.firestore.collection('notifications').add(notification);
  //     }
  //     console.log('Notifications added successfully.');
  //   } catch (error) {
  //     console.error('Error adding notifications: ', error);
  //   }
  // }
  async loadUsername(): Promise<void> {
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';
    this.currentusername = await this.userService.getUsernameById(
      userIdAsString
    );
    console.log(userIdAsString);
  }
  // Notify a list of users with a message
  // async createChatNotification(chatId: string, notifiedId: string) {
  //   try {
  //     console.log('in create notify');
  //     let currentusername = this.loadUsername();
  //     console.log(currentusername);
  //     const notification = {
  //       chatId,
  //       notifiedUserId: notifiedId,
  //       senderUserName: currentusername,
  //       text: 'You have new message from ',
  //       timestamp: new Date(),
  //     };
  //     await this.firestore.collection('notifications').add(notification);

  //     console.log('Notification added successfully.');
  //   } catch (error) {
  //     console.error('Error adding notification: ', error);
  //   }
  // }
  
  async createChatNotification( notifiedId: string) {
    try {
      console.log('in create notify');
      // Wait for loadUsername to complete and get the current username
      await this.loadUsername();
      console.log(this.currentusername); // Now you can access this.currentusername

      const userId = localStorage.getItem('userId');
      const userIdAsString = userId ? userId.toString() : '';
      const notification = {
        senderId: userIdAsString,
        notifiedUserId: notifiedId,
        senderUserName: this.currentusername, // Access this.currentusername directly
        text: 'You have a new message from ' + this.currentusername, // You can use it here as well
        timestamp: new Date(),
      };
      await this.firestore.collection('notifications').add(notification);

      console.log('Notification added successfully.');
    } catch (error) {
      console.error('Error adding notification: ', error);
    }
  }

  listenForNewMessages(
    chatId: string,
    callback: (messages: any) => void
  ): void {
    this.firestore
      .collection(`chats/${chatId}/messages`, (ref) =>
        ref.orderBy('timestamp', 'asc')
      )
      .stateChanges(['added'])
      .subscribe((actions) => {
        actions.forEach((action) => {
          if (action.type === 'added') {
            callback(action.payload.doc.data());
          }
        });
      });
  }
}
