import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  get username() {
    return this.signupForm.get('username');
  }

  get password() {
    return this.signupForm.get('password');
  }

  handleSubmit() {
    if (
      this.signupForm.valid &&
      this.signupForm.value.username == 'admin' &&
      this.signupForm.value.password == 'admin'
    ) {
      this.snackBar.open('Logged in', 'Close', {
        duration: 2000,
      });
    } else {
      console.log(this.signupForm.value);

      this.snackBar.open(
        'Please enter a valid username and password',
        'Close',
        {
          duration: 2000,
        }
      );
    }
  }
}
