import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as UrlConstants from '../../../shared/Url-Constants'

import { HttpService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formValue = this.loginForm.value;
    const payload = {
      identifier: formValue.email,
      userPassword: formValue.password
    };

    console.log('Login Payload:', payload);

    this.httpService.post(UrlConstants.loginUrl, {}, payload).subscribe({
      next: (response: any) => {
        console.log('Login Success:', response);
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          // Navigate to home or dashboard FIXME: Where to navigate? Assuming home for now
           this.router.navigate(['/home']); 
        }
      },
      error: (error) => {
        console.error('Login Failed:', error);
        alert('Login Failed: ' + (error.error?.message || error.message));
      }
    });
  }

  signup(payload: any): void {
     // unused
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
