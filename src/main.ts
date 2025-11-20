// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { App } from './app/app';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { AuthGuard } from './app/core/guards/auth.guard';
import { environment } from './environments/environment';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideRouter([
      { path: '', loadComponent: () => import('./app/pages/home/home').then(m => m.Home) },
      { path: 'login', loadComponent: () => import('./app/pages/login/login').then(m => m.Login) },
      { path: 'register', loadComponent: () => import('./app/pages/register/register').then(m => m.Register) },
      { path: 'forgot-password', loadComponent: () => import('./app/pages/forgot-password/forgot-password').then(m => m.ForgotPassword) },
      { path: 'verify', loadComponent: () => import('./app/pages/verify/verify').then(m => m.VerifyPage) },

      // محميّتان بموجب AuthGuard
      { path: 'profile', loadComponent: () => import('./app/pages/profile/profile').then(m => m.ProfilePage), canActivate: [AuthGuard] },
      { path: 'profile/edit', loadComponent: () => import('./app/pages/profile/edit').then(m => m.ProfileEditPage), canActivate: [AuthGuard] },
      { path: 'lost-items', loadComponent: () => import('./app/pages/lost-items/lost-items').then(m => m.LostItems), canActivate: [AuthGuard] },
      {path: 'lost-items/:id', loadComponent: () => import('./app/pages/lost-items-details/lost-items-details').then(m => m.LostItemDetail), canActivate: [AuthGuard]},

      { path: '**', redirectTo: '' }
    ])
  ]
}).catch(err => console.error(err));
