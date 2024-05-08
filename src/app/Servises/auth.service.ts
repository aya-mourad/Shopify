import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import  firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';


import {
  getAuth,
  createUserWithEmailAndPassword,
} from 'firebase/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http :HttpClient,private fireAuth:AngularFireAuth,private router: Router,private firestore: AngularFirestore) {}

  register(email:string,password:string){
    this.fireAuth.createUserWithEmailAndPassword(email,password).then(()=>{
      this.router.navigate(['/signin'])
    },err=>{
      alert(err.message)
      this.router.navigate(['/signup'])
    }
  )}
  createUser(user: any): Promise<any> {
    return this.firestore.collection('users').doc(user.uid).set(user);
  }
  // register(email: string, password: string, username: string, phoneNumber: string): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     this.fireAuth.createUserWithEmailAndPassword(email, password)
  //       .then((userCredential) => {
  //         if (userCredential && userCredential.user) {
  //           // Once the user is created, update their profile with additional information
  //           userCredential.user.updateProfile({
  //             displayName: username
  //           }).then(() => {
  //             // Associate phone number with the user
  //             const currentUser = firebase.auth().currentUser;
  //             if (currentUser) {
  //               currentUser.updatePhoneNumber(phoneNumber).then(() => {
  //                 console.log('Phone number linked successfully!');
  //                 this.router.navigate(['/signin']);
  //                 resolve();
  //               }).catch((error: Error) => {
  //                 console.error('Error registering user:', error);
  //                 reject(error);
  //               });
  //             } else {
  //               reject(new Error('Current user is null'));
  //             }
  //           }).catch((error) => {
  //             console.error('Error updating user profile:', error);
  //             reject(error);
  //           });
  //         } else {
  //           reject(new Error('User credential or user is null'));
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error registering user:', error);
  //         reject(error);
  //       });
  //   });
  // }


  // loginMethod(email:string,password:string ){
  //   this.fireAuth.signInWithEmailAndPassword(email,password).then(()=>{
  //     localStorage.setItem('token','true');
  //     this.router.navigate(['/home'])
  //   },err=>{
  //     alert(err.message)
  //     this.router.navigate(['/signin'])
  //   }
  // )}

  
  loginMethod(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User successfully signed in
        const user = userCredential.user;
        const userId = user?.uid; // Use optional chaining to access uid safely
        if (userId) {
          localStorage.setItem('userId', userId); // Store the user ID in localStorage
          localStorage.setItem('token', 'true');
          this.router.navigate(['/home']);
        } else {
          console.error('User ID is null');
          // Handle the case where user ID is null, if needed
        }
      })
      .catch((error) => {
        // Handle sign-in errors
        console.error('Error signing in:', error);
        alert(error.message);
        this.router.navigate(['/signin']);
      });
  }
  


logout(){
  this.fireAuth.signOut().then(()=>{
    localStorage.removeItem('token')
    this.router.navigate(['/signin'])
  },err=>{
    alert(err.message)
  }
)}

}