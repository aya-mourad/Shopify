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
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: MessagesComponent,
  //     multi: true,
  //   },
  // ],
})
export class MessagesComponent implements OnInit {
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
    console.log('hello iam message');
    const userId = localStorage.getItem('userId');
    const userIdAsString = userId ? userId.toString() : '';
    this.currentUserId = userIdAsString;
    this.selectedUserId = this._activated.snapshot.params['sellerID'];
  }

  ngOnInit(): void {
    console.log('hello iam message');
    // this.users$ = this.firestore.collection('users').valueChanges();
    // this.userService.getCurrentUser().subscribe((user) => {
    //   this.currentUser = user;
    //   this.currentUserId = user?.uid ?? 'Anonymous';
    // });
    // this.loadUsers();
    this.loadMessages();
  }

  loadMessages(): void {
    // if (!this.selectedUserId) return;
    console.log('hello iam message');
    const chatId = [this.currentUserId, this.selectedUserId].sort().join('_');
    const chatDoc = this.firestore.collection('chats').doc(chatId);

    // Check if the chat exists
    chatDoc.get().subscribe((chatSnapshot) => {
      if (!chatSnapshot.exists) {
        // If the chat doesn't exist, create it
        chatDoc.set({
          participants: [this.currentUserId, this.selectedUserId],
        });
      }
    });

    // Load messages
    // this.messages = []; // Clear previous messages
    // this.firestore
    //   .collection(`chats/${chatId}/messages`, (ref) =>
    //     ref.orderBy('timestamp', 'asc')
    //   )
    //   .valueChanges()
    //   .subscribe((messages: any[]) => {
    //     this.messages = messages;
    //   });
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

    this.messageService.sendMessage(chatId, messageData);
    // this.firestore
    //   .collection('chats')
    //   .doc(chatId)
    //   .collection('messages')
    //   .add(messageData)
    //   .then(() => {
    //     this.newMessage = '';
    //   });
  }
}
