import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // لو الدالة isAuthenticated بترجع true، اسمح بالمرور
  if (authService.isAuthenticated()) {
    return true;
  }

  // لو مش مسجل، حوله لصفحة الدخول واحتفظ بالرابط اللي كان عايز يروحه
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};