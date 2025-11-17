// src/app/pages/forgot-password/forgot-password.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppNavbar } from '../../shared/navbar/navbar';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AppNavbar],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {
  form: FormGroup;            // لا تهيّئ هنا باستخدام this.fb
  loading = false;
  errorMessage = '';
  successMessage = '';

  // أثناء التطوير مع MockInterceptor ضع '/api' أو استخدم عنوان الباك عندما يصبح متاحًا
  private apiBase = '/api';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // إنشاء الفورم داخل الكونستركتور (يحمي من fb used before init)
    this.form = this.fb.group({
      input: ['', [Validators.required, Validators.email]] // تفترض أنك تدخل إيميل. لو تريد دعم رقم هاتف عدل الـ Validators.
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
  this.errorMessage = '';
  this.successMessage = '';

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const payload = {
    email: this.f['input'].value // أو emailOrPhone لو الباك يحتاجه
  };

  this.loading = true;

  this.http.post(`${this.apiBase}/Auth/forgot-password`, payload).pipe(
    catchError(err => {
      this.loading = false;

      if (err?.status === 0) {
        this.errorMessage = 'لا يمكن الوصول إلى الخادم. تحقق من اتصالك.';
      } else if (err?.error?.message) {
        this.errorMessage = err.error.message;
      } else if (err?.error) {
        this.errorMessage =
          typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
      } else {
        this.errorMessage = 'حدث خطأ أثناء الإرسال.';
      }

      return of(null);
    })
  ).subscribe((res: any) => {
    this.loading = false;
    if (!res) return;

    if (res.isSuccess === false) {
      this.errorMessage = res.message || 'فشل الإرسال.';
      return;
    }

    this.successMessage = res.message || 'تم إرسال رمز التحقق!';

    // 🟦 احفظ الإيميل
    sessionStorage.setItem('resetTarget', payload.email);

    // 🟩 احفظ رمز الـ MOCK (إن وجد)
    if (res.data?.code) {
      sessionStorage.setItem('mockResetCode', res.data.code);
      console.log('MOCK reset code:', res.data.code);
    }

    // انتقل لصفحة Verify بعد لحظة بسيطة
    setTimeout(() => {
      this.router.navigate(['/verify']);
    }, 700);
  });
}

}
