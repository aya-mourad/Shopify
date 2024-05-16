import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { User as FirebaseUser } from 'firebase/auth';
import { UserService } from './../../Servises/user.service';
import { MessagesService } from './../../Servises/messages.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { message } from 'src/app/interfaces/message';
import { of } from 'rxjs';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  // currentUser: FirebaseUser | null = null;
  currentUserId: string = ''; // Should be set from authentication
  selectedUserId: string = '';
  // users: any[] = []; // List of chat users
  messages: Array<any> = [];
  newMessage: string = '';
  Messages: Observable<message[] | undefined> = of(undefined);
  searchControl = new FormControl();
  // users$!: Observable<any[]>;
  // filteredUsers$: Observable<any[]> | undefined;
  chatId: string = ''; // You might want to dynamically set this based on the chat room
  userId: string = ''; // You might want to dynamically set this based on the chat room

  constructor(
    private messageService: MessagesService,
    private firestore: AngularFirestore,
    private userService: UserService,
    private _activated: ActivatedRoute,
    private router: Router
  ) {
    // console.log('hello iam message');
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';
    this.currentUserId = userIdAsString;
    this.selectedUserId = this._activated.snapshot.params['sellerID'];
  }

  ngOnInit(): void {
    // console.log('hello iam message');
    this.loadMessages();
  }

  loadMessages(): void {
    // if (!this.selectedUserId) return;
    console.log('loading messages');
    const chatId = [this.currentUserId, this.selectedUserId].sort().join('_');
    const chatDoc = this.firestore.collection('chats').doc(chatId);

    // Check if the chat exists
    chatDoc.get().subscribe((chatSnapshot) => {
      if (!chatSnapshot.exists) {
        console.log(' new chat');
        // If the chat doesn't exist, create it
        chatDoc.set({
          participants: [this.currentUserId, this.selectedUserId],
        });
      }
    });

    this.Messages = this.messageService.getMessages(chatId);
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const chatId = [this.currentUserId, this.selectedUserId].sort().join('_');
    const messageData = {
      text: this.newMessage,
      senderId: this.currentUserId,
      receiverId: this.selectedUserId,
      timestamp: new Date(),
    };
    console.log('sending msg');
    console.log(messageData);
    // this.messageService.sendMessage(chatId, messageData);
    this.firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(messageData)
      .then(() => {
        this.newMessage = '';
      });

    this.messageService.createChatNotification(this.selectedUserId);
  }
}
