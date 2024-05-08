import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Servises/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email:string=''
  password:string=''
  constructor(private auth: AuthService, private router: Router) { }
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z][A-Za-z0-9]{4,10}$/)]),
  })

 loginSubmit(Form:FormGroup ){
  if(this.loginForm.valid){
    this.auth.loginMethod(this.email,this.password)
    this.router.navigate(['/home'])
    this.email=''
    this.password=''
  }
}
}

