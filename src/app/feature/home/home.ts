import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

   private router = inject(Router);

   logout() {
    // 🔹 If you store token in localStorage/sessionStorage — clear it
    localStorage.removeItem('auth_token'); // optional

    this.router.navigate(['/']);  // 👈 go back to login
  }

}
