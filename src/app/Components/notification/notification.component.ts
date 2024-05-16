import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { User as FirebaseUser } from 'firebase/auth';
import { UserService } from './../../Servises/user.service';
import { MessagesService } from './../../Servises/messages.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { notification } from 'src/app/interfaces/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  Notifications: Observable<notification[] | undefined> = of(undefined);
  notifications: any[] = [];
  constructor(
    private notificationsService: MessagesService,
    private usersService: UserService
  ) {}
  ngOnInit() {
    this.fetchUserNotifications();
  }

  fetchUserNotifications() {
    // if (!this.currentUserId) return;
    this.Notifications = this.notificationsService.getUserNotifications();
    this.Notifications.subscribe((notifications) => {
      console.log(notifications);
    });
  }
}
