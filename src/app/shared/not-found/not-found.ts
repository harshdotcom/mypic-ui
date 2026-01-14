import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>Page not found</p>
      <a routerLink="/">Go to home</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      margin-top: 100px;
    }
  `]
})
export class NotFoundComponent {}
