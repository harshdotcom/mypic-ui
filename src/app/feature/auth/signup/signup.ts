import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup implements OnInit {

  signupForm!: FormGroup;
  logoPreview: string | null = null;
  base64Logo: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userName: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(6)]],
      userLogoURL: ['']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.logoPreview = reader.result as string;
      this.base64Logo = reader.result as string;

      this.signupForm.patchValue({
        userLogoURL: this.base64Logo
      });
    };
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const payload = this.signupForm.value;

    console.log('FINAL SIGNUP PAYLOAD:', payload);
  }

  goToLogin() {
  this.router.navigate(['/login']);
}
}
