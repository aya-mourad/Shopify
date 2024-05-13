import { Component , OnInit} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, NG_VALUE_ACCESSOR} from '@angular/forms'
import { Observable, map, startWith } from 'rxjs';
import { User as FirebaseUser } from 'firebase/auth';
import { UserService } from './../../Servises/user.service';
import { MessagesService } from './../../Servises/messages.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:MessagesComponent,
      multi:true,
    }
  ]
})
export class MessagesComponent implements OnInit{

  currentUser: FirebaseUser | null = null;
  currentUserId: string = '';  // Should be set from authentication
  selectedUserId: string = '';
  users: any[] = [];           // List of chat users
  messages: Array<any> = [];
  newMessage: string = '';

  searchControl = new FormControl();

  users$!: Observable<any[]>;
  filteredUsers$: Observable<any[]>|undefined;
  
  
  chatId: string = '';  // You might want to dynamically set this based on the chat room
  userId: string = ''; // You might want to dynamically set this based on the chat room


  constructor( private messageService: MessagesService ,private firestore: AngularFirestore , private userService: UserService
    , private router: Router) {
      const userId = localStorage.getItem('userId');
      const userIdAsString = userId ? userId.toString() : '';
     }

    redirectToChat(user: any): void {
      // Redirect to the chat page or do any other logic here
      this.router.navigate(['/', user.uid]);
    }

  ngOnInit(): void {
    this.users$ = this.firestore.collection('users').valueChanges();
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      this.currentUserId = user?.uid ?? 'Anonymous';
    });
    this.loadMessages();
    this.loadUsers();
  }
  loadUsers(): void {
    this.firestore.collection('users').valueChanges({ idField: 'uid' })  
      .subscribe(users => {
        this.users = users;
      });
  }

  selectUser(uid: string): void {
    this.selectedUserId = uid;
    this.loadMessages();
  }

  loadMessages(): void {
    if (!this.selectedUserId) return;

    const chatId = [this.currentUserId, this.selectedUserId].sort().join('_');
    this.firestore.collection('chats').doc(chatId).collection('messages', ref => ref.orderBy('timestamp', 'asc'))
      .valueChanges().subscribe(messages => {
        this.messages = messages;
      });
  }


  

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const chatId = [this.currentUserId, this.selectedUserId].sort().join('_');
    const messageData = {
      text: this.newMessage,
      sender: this.currentUserId,
      timestamp: new Date(),
    };

    this.firestore.collection('chats').doc(chatId).collection('messages')
      .add(messageData).then(() => {
        this.newMessage = '';
      });



   
    
  }




}
