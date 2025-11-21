// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Public page imports
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Password } from './pages/password/password';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { VerifyPage } from './pages/verify/verify';
import { Test } from './pages/test/test';

// Protected page imports
import { ProfilePage } from './pages/profile/profile';
import { ProfileEditPage } from './pages/profile/edit';
import { LostItems } from './pages/lost-items/lost-items';
import { LostItemDetail } from './pages/lost-items-details/lost-items-details';
import { Homeafterregister } from './pages/homeafterregister/homeafterregister';
import { WhatYouLost } from './pages/what-you-lost/what-you-lost';
import { WhatYouFound } from './pages/what-you-found/what-you-found';
import { Reportaboutlosted } from './pages/reportaboutlosted/reportaboutlosted';
import { Reportaboutfound } from './pages/reportaboutfound/reportaboutfound';

export const routes: Routes = [
  // Public routes
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'password', component: Password },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'verify', component: VerifyPage },
  { path: 'test', component: Test },

  // Protected routes with authGuard
  { path: 'profile', component: ProfilePage, canActivate: [authGuard] },
  { path: 'profile/edit', component: ProfileEditPage, canActivate: [authGuard] },
  { path: 'lost-items', component: LostItems, canActivate: [authGuard] },
  { path: 'lost-items/:id', component: LostItemDetail, canActivate: [authGuard] },

  // Additional protected routes
  { path: 'homeafterregister', component: Homeafterregister, canActivate: [authGuard] },
  { path: 'what-you-lost', component: WhatYouLost, canActivate: [authGuard] },
  { path: 'what-you-found', component: WhatYouFound, canActivate: [authGuard] },
  { path: 'report-about-lost', component: Reportaboutlosted, canActivate: [authGuard] },
  { path: 'report-about-found', component: Reportaboutfound, canActivate: [authGuard] },

  // Wildcard route
  { path: '**', redirectTo: '' }
];
