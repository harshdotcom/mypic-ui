import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as UrlConstants from '../../../shared/Url-Constants';
import { HttpService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup implements OnInit {

  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userName: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(6)]],
      userLogoURL: ['']
    });
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const payload = this.signupForm.value;

    console.log('FINAL SIGNUP PAYLOAD:', payload);
    
    this.httpService.post(UrlConstants.signupUrl, {}, payload).subscribe({
      next: (response: any) => {
        console.log('Signup Success:', response);
         alert('Signup Successful! Please Login.');
        this.goToLogin();
      },
      error: (error: any) => {
        console.error('Signup Failed:', error);
        alert('Signup Failed: ' + (error.error?.message || error.message));
      }
    });
  }

  goToLogin() {
  this.router.navigate(['/login']);
}
}
