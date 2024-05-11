import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Servises/auth.service';
import { ChatService } from '../../Servises/chatservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})



export class ChatComponent implements OnInit {
  users: any[] = [];
  selectedUser: any;
  messages: any[] = [];
  newMessage: string = '';
  messageForm: FormGroup;
  sendingMessage: boolean = false; //  track whether a message is being sent

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private formBuilder: FormBuilder
  ) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  openChat(user: any) {
    this.selectedUser = user;
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId) {
      this.chatService.getMessages(currentUserId, user.id).subscribe((data: any) => {
        this.messages = data;
      });
    } else {
      console.error('Current user ID is null.');
    }
  }

  sendMessage() {
    if (this.messageForm.valid && !this.sendingMessage) { // Check form validity and if a message is not already being sent
      const currentUserId = this.authService.getCurrentUserId();
      if (currentUserId) {
        const message = {
          senderId: currentUserId,
          receiverId: this.selectedUser.id,
          content: this.newMessage,
          timestamp: new Date()
        };
        this.sendingMessage = true; 
        this.chatService.sendMessage(message).then(() => {
          this.newMessage = ''; 
          this.sendingMessage = false; 
        }).catch(error => {
          console.error('Error sending message:', error);
          this.sendingMessage = false;
        });
      } else {
        console.error('Current user ID is null.');
      }
    }
  }
}


















/*export class ChatComponent implements OnInit {
  users: any[] = [];
  selectedUser: any;
  messages: any[] = [];
  newMessage: string = '';
  messageForm: FormGroup; 

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private formBuilder: FormBuilder
  ) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }



  openChat(user: any) {
    this.selectedUser = user;
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId) {
      this.chatService.getMessages(currentUserId, user.id).subscribe((data: any) => {
        this.messages = data;
      });
    } else {
      console.error('Current user ID is null.');
    }
  }

  sendMessage() {
  const currentUserId = this.authService.getCurrentUserId();
  if (currentUserId) {
    const message = {
      senderId: currentUserId,
      receiverId: this.selectedUser.id,
      content: this.newMessage,
      timestamp: new Date()
    };
    this.chatService.sendMessage(message).then(() => {
      this.newMessage = ''; // Clear the newMessage field after sending
    }).catch(error => {
      console.error('Error sending message:', error);
    });
  } else {
    console.error('Current user ID is null.');
  }
}
}


*/









