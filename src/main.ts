// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { App } from './app/app';
import { MockInterceptor } from './app/core/interceptors/mock.interceptor';

bootstrapApplication(App, {
  providers: [
    // هنا نطلب HttpClient ونقول له "استخدم الـ interceptors المسجلين في DI"
    provideHttpClient(withInterceptorsFromDi()),
    // ثم نسجل الـ MockInterceptor بنفس طريقة Angular التقليدية
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },

    provideRouter([
      { path: '', loadComponent: () => import('./app/pages/home/home').then(m => m.Home) },
      { path: 'login', loadComponent: () => import('./app/pages/login/login').then(m => m.Login) },
      { path: 'register', loadComponent: () => import('./app/pages/register/register').then(m => m.Register) },
      { path: 'forgot-password', loadComponent: () => import('./app/pages/forgot-password/forgot-password').then(m => m.ForgotPassword) },
      { path: 'verify', loadComponent: () => import('./app/pages/verify/verify').then(m => m.VerifyPage) },
      { path: '**', redirectTo: '' }
    ])
  ]
}).catch(err => console.error(err));
