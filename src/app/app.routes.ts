import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./feature/auth/login/login').then(c => c.Login)
  },
   {
    path: 'signup',
    loadComponent: () =>
      import('./feature/auth/signup/signup').then(c => c.Signup)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./feature/home/home').then(c => c.Home)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found/not-found').then(c => c.NotFoundComponent)
  }
];
