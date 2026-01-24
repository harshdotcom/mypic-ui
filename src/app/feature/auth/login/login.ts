import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as UrlConstants from '../../../shared/Url-Constants'

import { HttpService } from '../../../shared/services/http.service';
import { environment } from '../../../../environments/environment';

declare global {
  interface Window {
    google: any;
  }
}

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
    private httpService: HttpService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn() {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleCredentialResponse(response)
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-btn-wrapper"),
        { theme: "outline", size: "large", width: "100%" } 
      );
    }
  }

  handleCredentialResponse(response: any) {
    console.log("Encoded JWT ID token: " + response.credential);
    
    // We need to run inside Angular zone because this callback comes from outside
    this.ngZone.run(() => {
        const payload = {
            idToken: response.credential
        };
        
        this.httpService.post(UrlConstants.googleLoginUrl, {}, payload).subscribe({
            next: (res: any) => {
                console.log('Google Login Success:', res);
                 if (res && res.token) {
                    localStorage.setItem('token', res.token);
                    this.router.navigate(['/home']);
                }
            },
            error: (err) => {
                console.error('Google Login Error:', err);
                alert('Google Login Failed');
            }
        });
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
