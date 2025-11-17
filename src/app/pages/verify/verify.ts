// src/app/pages/verify/verify.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppNavbar } from '../../shared/navbar/navbar';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppNavbar],
  templateUrl: './verify.html',
  styleUrls: ['./verify.css']
})
export class VerifyPage {

  form:any
  loading = false;
  error = '';
  success = '';

  private apiBase = '/api'; // يعمل مع MockInterceptor

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), this.passwordStrength()]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.matchPasswords('newPassword', 'confirmPassword') });
  }

  get f() { return this.form.controls; }

  passwordStrength(): ValidatorFn {
    return (control: AbstractControl) => {
      const v = control.value || '';
      const ok = /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) && /[^a-zA-Z0-9]/.test(v);
      return ok ? null : { weakPassword: true };
    };
  }

  matchPasswords(password: string, confirm: string): ValidatorFn {
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

    const payload = {
      code: this.f['code'].value,
      newPassword: this.f['newPassword'].value,
      confirmPassword: this.f['confirmPassword'].value
    };

    this.loading = true;

    this.http.post(`${this.apiBase}/Auth/reset-password`, payload).pipe(
      catchError(err => {
        this.loading = false;
        this.error = err?.error?.message || 'حدث خطأ أثناء العملية.';
        return of(null);
      })
    ).subscribe((res: any) => {
      this.loading = false;

      if (!res) return;

      if (!res.isSuccess) {
        this.error = res.message;
        return;
      }

      this.success = res.message;
      setTimeout(() => this.router.navigate(['/login']), 700);
    });
  }
}
