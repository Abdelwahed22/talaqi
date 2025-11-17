// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
// import { Observable, map, tap } from 'rxjs';

// interface ApiResponse<T = any> {
//   isSuccess: boolean;
//   message: string;
//   data: T | null;
//   errors?: any;
// }

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private base = `${environment.apiUrl}/Auth`;

//   constructor(private http: HttpClient) {}

//   login(payload: { email: string; password: string }): Observable<void> {
//     return this.http.post<ApiResponse<any>>(`${this.base}/login`, payload).pipe(
//       map(res => {
//         if (!res.isSuccess) throw new Error(res.message || 'Login failed');
//         return res.data;
//       }),
//       tap(data => {
//         const token = data?.accessToken;
//         if (token) localStorage.setItem('access_token', token);
//         if (data?.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);
//       }),
//       map(() => void 0)
//     );
//   }

//   logout() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//   }

//   getToken(): string | null {
//     return localStorage.getItem('access_token');
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }
// }




























// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppUser } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  isSuccess: boolean;
  data?: { accessToken?: string; refreshToken?: string; expiresAt?: string; user?: AppUser };
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AppUser | null>(this.readUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'talaqi_access_token';
  private userKey = 'talaqi_user';

  constructor(private http: HttpClient, private router: Router) {}

  private readUserFromStorage(): AppUser | null {
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? JSON.parse(raw) as AppUser : null;
    } catch {
      return null;
    }
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey) && !!this.currentUserSubject.value;
  }

  login(email: string, password: string) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/login`, { email, password })
      .pipe(
        tap(res => {
          if (res?.data?.accessToken) {
            localStorage.setItem(this.tokenKey, res.data.accessToken);
            localStorage.setItem(this.userKey, JSON.stringify(res.data.user || null));
            this.currentUserSubject.next(res.data.user || null);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ممكن تضيف refresh token هنا لاحقًا
}
