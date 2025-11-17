// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'password', loadComponent: () => import('./pages/password/password').then(m => m.Password) },
  {path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword)},
  {path: 'verify', loadComponent: () => import('./pages/verify/verify').then(m => m.VerifyPage )},
  // ... باقي المسارات
];
