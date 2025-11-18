// src/app/pages/register/register.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNavbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  form: FormGroup;
  loading = false;
  error = '';

  private apiBase = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordStrength()]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.matchPasswords('password', 'confirmPassword') });
  }

  get f() { return this.form.controls; }

  private passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value as string;
      if (!v) return null;
      const hasUpper = /[A-Z]/.test(v);
      const hasLower = /[a-z]/.test(v);
      const hasDigit = /\d/.test(v);
      const hasSpecial = /[!@#\$%\^\&*\)\(+=._-]/.test(v);
      return (hasUpper && hasLower && hasDigit && hasSpecial) ? null : { weakPassword: true };
    };
  }

  private matchPasswords(passwordKey: string, confirmKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pw = group.get(passwordKey)?.value;
      const cpw = group.get(confirmKey)?.value;
      if (pw && cpw && pw !== cpw) {
        group.get(confirmKey)?.setErrors({ notMatch: true });
        return { notMatch: true };
      } else {
        const err = group.get(confirmKey)?.errors;
        if (err) {
          delete err['notMatch'];
          if (Object.keys(err).length === 0) group.get(confirmKey)?.setErrors(null);
        }
        return null;
      }
    };
  }

  onSubmit(): void {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      phoneNumber: this.f['phoneNumber'].value,
      password: this.f['password'].value,
      confirmPassword: this.f['confirmPassword'].value
    };

    this.loading = true;

    this.http.post<any>(`${this.apiBase}/Auth/register`, payload).pipe(
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: (res) => {
        if (!res) return;
        if (res.isSuccess === true || (res.data && res.data.accessToken)) {
          // لو الباك يرجع توكن وعايز تسجّل دخـول تلقائياً، ممكن تخزن التوكن هنا.
          // localStorage.setItem('accessToken', res.data.accessToken);
          this.router.navigate(['/login']);
        } else {
          this.error = res.message || (res.errors ? JSON.stringify(res.errors) : 'فشل التسجيل');
        }
      },
      error: (err) => {
        console.error('Register error', err);
        this.error = this.parseBackendError(err);
      }
    });
  }

  private parseBackendError(err: any): string {
    if (err?.status === 0) return 'لا يمكن الوصول إلى الخادم. تأكد أن الباك يعمل أو إعدادات CORS صحيحة.';
    if (err?.error) {
      const body = err.error;
      if (body.message) return body.message;
      if (body.errors) return Array.isArray(body.errors) ? body.errors.join(' - ') : JSON.stringify(body.errors);
      if (typeof body === 'string') return body;
    }
    return err?.message || 'حدث خطأ أثناء التسجيل';
  }
}
