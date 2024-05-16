import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servises/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email:string=''
  password:string=''
  name: string=''
  phone: string=''
  profilePicture:string=''
  constructor(private auth:AuthService){}

  registerForm:FormGroup=new FormGroup ({
  name : new FormControl(null,[Validators.required,Validators.minLength(2)]),
  email : new FormControl(null,[Validators.required,Validators.email]),
  password : new FormControl(null,[Validators.required,Validators.pattern(/^[A-Z][A-Za-z0-9]{4,20}$/)]),
  phone : new FormControl(null,[Validators.required,Validators.pattern(/^(002)?(01)[0125][0-9]{8}$/)]),
  profilePicture : new FormControl(null,[Validators.required])
})
 
registerSubmit(Form:FormGroup ){
  if(this.registerForm.valid){
    this.auth.register(this.registerForm.get('email')?.value,this.registerForm.get('password')?.value,this.registerForm.get('name')?.value,this.registerForm.get('phone')?.value,this.registerForm.get('profilePicture')?.value),
    this.email=''
    this.password=''
    this.name=''
    this.phone=''
    this.profilePicture="https://res.cloudinary.com/dnem3okap/image/upload/v1715689285/nqwlbqa4c4n8msxfy36b.png"
  }
}
}
