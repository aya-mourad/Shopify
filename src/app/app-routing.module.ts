import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { MessagesComponent } from './Components/messages/messages.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { WishlistComponent } from './Components/wishlist/wishlist.component';
import { SigninComponent } from './AuthComponents/signin/signin.component';
import { SignupComponent } from './AuthComponents/signup/signup.component';
import { AddFeedbackComponent } from './Components/add-feedback/add-feedback.component';
import { NotificationComponent } from './Components/notification/notification.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { AddproductComponent } from './Components/addproduct/addproduct.component';

 const routes: Routes = [
  // { path: '/',component:HomeComponent},
  { path: '',component:HomeComponent},
  { path: 'home',component:HomeComponent},
  { path: 'profile',component:ProfileComponent},
  //{ path: 'chat',component:ChatComponent},
  { path: 'wishlist',component:WishlistComponent},
  { path: 'notification',component:NotificationComponent},
  { path: 'payment',component:PaymentComponent},
  { path: 'addproduct',component:AddproductComponent},
  { path: 'signup',component:SignupComponent},
  { path: 'signin',component:SigninComponent},
  { path: ':productdetails/:productId',component:ProductDetailsComponent},
  //{ path: ':name/chat',component:ChatComponent},
  { path:'messages' , component:MessagesComponent},
  { path: ':product-id/feedback',component:AddFeedbackComponent},
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
