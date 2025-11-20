// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkLogin(state.url);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkLogin(state.url);
  }

  private checkLogin(returnUrl: string): boolean | UrlTree {
    // AuthService.isAuthenticated() في مشروعك عبارة عن method أو getter
    const authenticated = (typeof this.auth.isAuthenticated === 'function')
      ? this.auth.isAuthenticated()
      : !!(this.auth as any).isAuthenticated;

    if (authenticated) {
      return true;
    }

    // لو مش مسجل — نحول لصفحة login ونمرّر returnUrl كـ query param
    return this.router.createUrlTree(['/login'], { queryParams: { returnUrl } });
  }
}
