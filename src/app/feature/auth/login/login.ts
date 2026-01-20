import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as UrlConstants from '../../../shared/Url-Constants'

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
    private router: Router
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

    console.log('Login Payload:', this.loginForm.value);

    // TODO: call your auth service here
    // this.authService.login(this.loginForm.value).subscribe(...)
  }

  signup(payload: any): void {
    // console.log('Calling:', UrlConstants.AUTH.SIGNUP, payload);
    // return of({ success: true });
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
