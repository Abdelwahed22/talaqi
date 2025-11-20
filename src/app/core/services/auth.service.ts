// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePictureUrl?: string | null;
  role?: string;
}

interface AuthResponse {
  isSuccess?: boolean;
  data?: { accessToken?: string; refreshToken?: string; expiresAt?: string; user?: AppUser } | any;
  message?: string;
  errors?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'accessToken';
  private userKey = 'user';
  private currentUserSubject = new BehaviorSubject<AppUser | null>(this.readUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private readUserFromStorage(): AppUser | null {
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? (JSON.parse(raw) as AppUser) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  // يقوم فقط بالـ HTTP POST ويرجع الـ observable
  login(email: string, password: string) {
return this.http.post<AuthResponse>(`${environment.apiUrl}/api/Auth/login`, { email, password });
  }

  // بعد نجاح login، احفظ بيانات الـ auth (توكن + user)
  saveAuthDataFromResponse(res: AuthResponse | any) {
    const data = (res && res.data) ? res.data : res;
    const token = data?.accessToken ?? data?.token ?? null;
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    }
    if (data?.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    if (data?.user) {
      localStorage.setItem(this.userKey, JSON.stringify(data.user));
      this.currentUserSubject.next(data.user);
    }
  }

  setCurrentUser(user: AppUser | null) {
    if (user) localStorage.setItem(this.userKey, JSON.stringify(user));
    else localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
