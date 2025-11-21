import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

// تأكد إن الـ Interfaces دي موجودة في user.model.ts زي ما اتفقنا
// لو مش موجودة هناك، ممكن تسيب تعريف AppUser هنا مؤقتاً
export interface AppUser extends User {} 

@Injectable({ providedIn: 'root' })
export class AuthService {
  // 1. Dependencies (Modern Injection)
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // 2. Configuration
  private apiUrl = `${environment.apiUrl}/auth`; // Now will be https://localhost:7282/api/auth
  private tokenKey = 'accessToken';
  private userKey = 'user';

  // 3. State Management (Reactive)
  // بنقرأ المستخدم من الـ Storage أول ما التطبيق يفتح
  private currentUserSubject = new BehaviorSubject<AppUser | null>(this.readUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // --- Authentication Methods ---

  // تسجيل الدخول
  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        // ميزة الـ tap: بتنفذ كود جانبي من غير ما تأثر على الداتا اللي راجعة للـ Component
        tap(response => {
          if (response.isSuccess && response.data) {
            this.saveAuthData(response.data);
          }
        })
      );
  }

  // إنشاء حساب جديد
  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          if (response.isSuccess && response.data) {
            this.saveAuthData(response.data);
          }
        })
      );
  }

  // تسجيل الخروج
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null); // بنبلغ التطبيق كله إن المستخدم خرج
    this.router.navigate(['/login']);
  }

  // --- Helper Methods ---

  // التحقق هل المستخدم مسجل دخول ولا لأ (عشان الـ Guard)
  isAuthenticated(): boolean {
    // لازم يكون فيه توكن + بيانات يوزر في الـ State
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // دالة مركزية لحفظ البيانات
  private saveAuthData(data: AuthResponse) {
    if (data.accessToken) {
      localStorage.setItem(this.tokenKey, data.accessToken);
    }
    
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    if (data.user) {
      localStorage.setItem(this.userKey, JSON.stringify(data.user));
      this.currentUserSubject.next(data.user as AppUser); // تحديث الحالة
    }
  }

  private readUserFromStorage(): AppUser | null {
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // Method to update current user (e.g., after profile picture upload)
  setCurrentUser(user: AppUser | null) {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.userKey);
    }
  }
}
