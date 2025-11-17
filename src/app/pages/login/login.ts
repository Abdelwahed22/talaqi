// // src/app/pages/login/login.ts
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { finalize } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { AppNavbar } from "../../shared/navbar/navbar";

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, HttpClientModule, AppNavbar , RouterModule],
//   templateUrl: './login.html',
//   styleUrls: ['./login.css']
// })
// export class Login {
//   form: FormGroup;
//   loading = false;
//   error = '';

//   private apiBase = environment.apiUrl;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private http: HttpClient
//   ) {
//     // إنشاء الفورم داخل الـ constructor (تجنّب "used before init")
//     this.form = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   get f() { return this.form.controls; }

//   onSubmit() {
//     this.error = '';

//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     const payload = {
//       email: this.f['email'].value,
//       password: this.f['password'].value
//     };

//     this.loading = true;

//     this.http.post<any>(`${this.apiBase}/Auth/login`, payload).pipe(
//       finalize(() => { this.loading = false; })
//     ).subscribe({
//       next: (res) => {
//         if (!res) {
//           this.error = 'استجابة غير متوقعة من الخادم';
//           return;
//         }

//         if (res.isSuccess === false) {
//           this.error = res.message || 'فشل تسجيل الدخول';
//           return;
//         }

//         // نفترض أن res.data يحتوي على accessToken, refreshToken
//         const data = res.data ?? res;
//         if (data?.accessToken) {
//           localStorage.setItem('accessToken', data.accessToken);
//           if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
//         }

//         // توجه للصفحة الرئيسية
//         this.router.navigate(['/']);
//       },
//       error: (err) => {
//         console.error('Login error', err);
//         this.error = this.parseBackendError(err);
//       }
//     });
//   }

//   private parseBackendError(err: any): string {
//     if (err?.status === 0) return 'لا يمكن الوصول إلى الخادم. تأكد أن الباك يعمل أو إعدادات CORS صحيحة.';
//     if (err?.error) {
//       const body = err.error;
//       if (body.message) return body.message;
//       if (body.errors) return Array.isArray(body.errors) ? body.errors.join(' - ') : JSON.stringify(body.errors);
//       if (typeof body === 'string') return body;
//     }
//     return err?.message || 'حدث خطأ أثناء تسجيل الدخول';
//   }
// }

// src/app/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppNavbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, AppNavbar, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  form: FormGroup;
  loading = false;
  error = '';

  private apiBase = environment.apiUrl;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      email: this.f['email'].value,
      password: this.f['password'].value,
    };

    this.loading = true;

    this.http
      .post<any>(`${this.apiBase}/Auth/login`, payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (!res) {
            this.error = 'استجابة غير متوقعة من الخادم';
            return;
          }

          if (res.isSuccess === false) {
            this.error = res.message || 'فشل تسجيل الدخول';
            return;
          }

          // successful login
          const data = res.data ?? res;

          if (data?.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }

          if (data?.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
          }
          if (data?.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }

          // go to home
          this.router.navigate(['/']);
        },

        error: (err) => {
          console.error('Login error', err);
          this.error = this.parseBackendError(err);
        },
      });
  }

  private parseBackendError(err: any): string {
    if (err?.status === 0) {
      return 'لا يمكن الوصول إلى الخادم. تأكد من تشغيل الباك أو إعدادات CORS.';
    }

    const body = err?.error;

    if (body) {
      if (body.message) return body.message;
      if (body.errors) {
        return Array.isArray(body.errors) ? body.errors.join(' - ') : JSON.stringify(body.errors);
      }
      if (typeof body === 'string') return body;
    }

    return err?.message || 'حدث خطأ أثناء تسجيل الدخول';
  }
}
