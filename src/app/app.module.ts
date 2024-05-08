// import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './AuthComponents/signin/signin.component';
import { SignupComponent } from './AuthComponents/signup/signup.component';
import { HomeComponent } from './Components/home/home.component';
import { AddFeedbackComponent } from './Components/add-feedback/add-feedback.component';
import { ChatComponent } from './Components/chat/chat.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { WishlistComponent } from './Components/wishlist/wishlist.component';
import { RegisterComponent } from './AuthComponents/register/register.component';
import { NavbarComponent } from './SharedComponents/navbar/navbar.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { NotificationComponent } from './Components/notification/notification.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import {AngularFireModule} from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { PaymentComponent } from './Components/payment/payment.component';
import { SearchPipe } from './search.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddproductComponent } from './Components/addproduct/addproduct.component';
@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    AddFeedbackComponent,
    ChatComponent,
    ProductDetailsComponent,
    ProfileComponent,
    WishlistComponent,
    NavbarComponent,
    NotfoundComponent,
    NotificationComponent,
    PaymentComponent,
    SearchPipe,
    RegisterComponent,
    AddproductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
