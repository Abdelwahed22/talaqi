import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map, tap } from 'rxjs';

interface ApiResponse<T = any> {
  isSuccess: boolean;
  message: string;
  data: T | null;
  errors?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiBaseUrl}/Auth`;

  constructor(private http: HttpClient) {}

  login(payload: { email: string; password: string }): Observable<void> {
    return this.http.post<ApiResponse<any>>(`${this.base}/login`, payload).pipe(
      map(res => {
        if (!res.isSuccess) throw new Error(res.message || 'Login failed');
        return res.data;
      }),
      tap(data => {
        const token = data?.accessToken;
        if (token) localStorage.setItem('access_token', token);
        if (data?.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);
      }),
      map(() => void 0)
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
