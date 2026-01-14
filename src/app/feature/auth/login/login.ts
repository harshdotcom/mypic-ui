import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onLogin() {
    // 🔹 Call your login API here and validate credentials

    const isLoginSuccessful = true; // replace with real API result

    if (isLoginSuccessful) {
      this.router.navigate(['/home']);   // 👈 redirect to home
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  
}
