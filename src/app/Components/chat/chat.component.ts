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















/* import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Servises/auth.service';
import { MessagingService } from '../../Servises/MessagingService.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup = new FormGroup({
    message: new FormControl('')
  });
  messages: any[] = []; // Initialize as an empty array

  constructor(private authService: AuthService, private messagingService: MessagingService) { }

  ngOnInit(): void {
    const currentUserID = this.authService.getUserIdAsString(); // Get the current user's ID
    const otherUserID = 'otherUserID'; // Replace 'otherUserID' with the ID of the other user the current user wants to chat with
    
    if (currentUserID) {
      // Fetch messages between current user and the other specific user
      this.messagingService.getMessages(currentUserID, otherUserID)
        .subscribe(messages => {
          console.log('Messages:', messages); // Log messages to check if they are retrieved
          this.messages = messages;
        });
    }
  }
  
  

  sendMessage(): void {
    const messageControl = this.messageForm.get('message');
    if (messageControl && messageControl.value && messageControl.value.trim() !== '') {
      // Send message to recipient (replace 'otherUserId' with actual user ID)
      const otherUserId = 'otherUserId'; // Replace with recipient's user ID
      this.messagingService.sendMessage(this.authService.currentUser?.uid ?? '', otherUserId, messageControl.value)
        .then(() => {
          console.log('Message sent successfully');
          this.messageForm.reset(); // Reset message form after sending
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
    }
  }
}
*/
  
