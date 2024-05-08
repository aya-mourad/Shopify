import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { UserService } from '../../Servises/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servises/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private userService: UserService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required,Validators.minLength(2),Validators.maxLength(10)],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required,Validators.pattern(/^(002)?(01)[0125][0-9]{8}$/)]],
      password: ['', [Validators.required, Validators.required,Validators.pattern(/^[A-Z][A-Za-z0-9]{4,10}$/)]]
    });
  }

  signup() {
    if (this.signupForm.valid) {
      const name = this.signupForm.get('name')?.value;
      const email = this.signupForm.get('email')?.value;
      const phone = this.signupForm.get('phone')?.value;
      const password = this.signupForm.get('password')?.value;

      this.auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
          const user = {
            name: name,
            email: email,
            phone: phone,
            uid: cred.user?.uid
          };
          this.userService.createUser(user)
            .then(() => {
              console.log('User created:', cred.user);
              this.router.navigate(['/signin'])
              this.signupForm.reset();

            })
            .catch(err => {
              console.error('Error:', err.message);
            });
        })
        .catch(err => {
          console.error('Error:', err.message);
        });
    }
  }
}

