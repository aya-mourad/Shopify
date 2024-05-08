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
  constructor(private auth:AuthService,private router:Router){}
  registerForm:FormGroup=new FormGroup ({
  // name : new FormControl(null,[Validators.required,Validators.minLength(2),Validators.maxLength(10)]),
  email : new FormControl(null,[Validators.required]),
  password : new FormControl(null,[Validators.required]),
  // rePassword : new FormControl(null,[Validators.required,Validators.pattern(/^[A-Z][A-Za-z0-9]{4,10}$/)]),
  // phone : new FormControl(null,[Validators.required,Validators.pattern(/^(002)?(01)[0125][0-9]{8}$/)])
})
 
registerSubmit(Form:FormGroup ){
  if(this.registerForm.valid){
    this.auth.register(this.email,this.password)
    this.email=''
    this.password=''
  }
}
}
