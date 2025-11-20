// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Password } from './pages/password/password';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { VerifyPage } from './pages/verify/verify';
import { ProfilePage } from './pages/profile/profile';
import { ProfileEditPage } from './pages/profile/edit';
import { Homeafterregister } from './pages/homeafterregister/homeafterregister';
import { Test } from './pages/test/test';
import { WhatYouLost } from './pages/what-you-lost/what-you-lost';
import { WhatYouFound } from './pages/what-you-found/what-you-found';
import { Reportaboutlosted } from './pages/reportaboutlosted/reportaboutlosted';
import { Reportaboutfound } from './pages/reportaboutfound/reportaboutfound';
// import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'password', component: Password },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'verify', component: VerifyPage },
  { path: 'profile', component: ProfilePage },
  { path: 'profile/edit', component: ProfileEditPage },
  //Abdelwahed Pathes
  //,canActivate:[authGuard]
  { path: 'homeafterregister', component: Homeafterregister },
  {path:'WhatYouLost',component:WhatYouLost },
  { path: 'WhatYouFound', component: WhatYouFound},
  {path:'Reportaboutlosted',component:Reportaboutlosted},
  {path:'Reportaboutfound',component:Reportaboutfound},
  { path: 'test', component: Test },
  { path: '**', redirectTo: '' }
];
