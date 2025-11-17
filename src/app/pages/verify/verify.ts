// src/app/pages/verify/verify.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormGroup
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNavbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, AppNavbar],
  templateUrl: './verify.html',
  styleUrls: ['./verify.css']
})
export class VerifyPage {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';

  private apiBase = environment.apiUrl;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), this.passwordStrength()]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.matchPasswords('newPassword', 'confirmPassword') });
  }

  get f() { return this.form.controls; }

  private passwordStrength(): ValidatorFn {
    return (control: AbstractControl) => {
      const v = control.value || '';
      const ok = /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) && /[^a-zA-Z0-9]/.test(v);
      return ok ? null : { weakPassword: true };
    };
  }

  private matchPasswords(password: string, confirm: string): ValidatorFn {
    return (group: AbstractControl) => {
      const pw = group.get(password)?.value;
      const cp = group.get(confirm)?.value;
      return pw === cp ? null : { notMatch: true };
    };
  }

  onSubmit() {
    this.error = '';
    this.success = '';
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    // اقرأ الايميل من sessionStorage (set في forgot-password)
    const email = sessionStorage.getItem('resetTarget') || '';

    // fallback: لو mock والكود مخزن في sessionStorage أيضاً
    const payload: any = {
      email,
      code: this.f['code'].value,
      newPassword: this.f['newPassword'].value,
      confirmPassword: this.f['confirmPassword'].value
    };

    this.loading = true;

    this.http.post<any>(`${this.apiBase}/Auth/reset-password`, payload).pipe(
      finalize(() => { this.loading = false; }),
      catchError(err => {
        if (err?.status === 0) {
          this.error = 'لا يمكن الوصول إلى الخادم. تحقق من اتصالك.';
        } else if (err?.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = err?.error ? JSON.stringify(err.error) : 'حدث خطأ أثناء العملية.';
        }
        return of(null);
      })
    ).subscribe(res => {
      if (!res) return;

      if (res.isSuccess === false) {
        this.error = res.message || 'فشل إعادة التعيين';
        return;
      }

      this.success = res.message || 'تمت إعادة تعيين كلمة المرور بنجاح';
      setTimeout(() => this.router.navigate(['/login']), 800);
    });
  }
}
