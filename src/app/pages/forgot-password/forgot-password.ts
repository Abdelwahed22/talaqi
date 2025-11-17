// src/app/pages/forgot-password/forgot-password.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppNavbar } from '../../shared/navbar/navbar';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AppNavbar  , RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {
  form: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  // غيّر هذا في environments حسب البيئة (dev/prod)
  private apiBase = environment.apiUrl; // مثال: 'https://localhost:7282/api'

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      input: ['', [Validators.required, Validators.email]] // هنا نفترض إدخال إيميل
    });
  }

  get f() { return this.form.controls; }

  //1==
  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      email: this.f['input'].value
    };

    this.loading = true;

    this.http.post(`${this.apiBase}/Auth/forgot-password`, payload).pipe(
      catchError(err => {
        this.loading = false;

        // حالة عدم اتصال بالسيرفر
        if (err?.status === 0) {
          this.errorMessage = 'لا يمكن الوصول إلى الخادم. تحقق من تشغيل الباك وإعدادات الشبكة.';
          return of(null);
        }

        // حالة 404 (إن وجد الباك يعيد 404 لو الإيميل غير موجود)
        if (err?.status === 404) {
          this.errorMessage = 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني.';
          return of(null);
        }

        // محاولة قراءة رسالة واضحة من جسم الخطأ
        if (err?.error) {
          const body = err.error;
          if (typeof body === 'object' && body.message) {
            // إذا الباك يرسل رسالة مفهومة
            // إذا الرسالة تدل أن الايميل غير موجود نعرض رسالة خاصة
            const m = (body.message as string).toLowerCase();
            if (m.includes('not found') || m.includes('not exists') || m.includes('غير موجود') || m.includes('not registered')) {
              this.errorMessage = 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني.';
            } else {
              this.errorMessage = body.message;
            }
            return of(null);
          }

          // لو الجسم نصي
          if (typeof body === 'string') {
            if (body.toLowerCase().includes('not found') || body.toLowerCase().includes('not exists')) {
              this.errorMessage = 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني.';
            } else {
              this.errorMessage = body;
            }
            return of(null);
          }
        }

        // fallback عام
        this.errorMessage = 'حدث خطأ أثناء الإرسال. حاول لاحقًا.';
        return of(null);
      })
    ).subscribe((res: any) => {
      this.loading = false;
      if (!res) return;

      // حسب وثيقة الـ API: res.isSuccess === true عند الإرسال الناجح
      if (res.isSuccess === true) {
        this.successMessage = res.message || 'تم إرسال رمز التحقق إذا كان البريد مسجلاً لدينا.';
        // خزّن البريد كي صفحة verify تعرف لأي إيميل نعمل reset
        sessionStorage.setItem('resetTarget', payload.email);

        // لو الباك (أثناء التطوير / mock) أرسل الكود في res.data.code — خزّنه مؤقتاً للـ debug
        if (res.data?.code) {
          sessionStorage.setItem('mockResetCode', res.data.code);
          console.log('MOCK reset code:', res.data.code);
        }

        // توجيه لصفحة التحقق بعد تأخير صغير لتحسين الـ UX
        setTimeout(() => this.router.navigate(['/verify']), 700);
        return;
      }

      // لو الـ API يرد isSuccess=false نعرض الرسالة أو نتحقق إن المعلومة تقول "لا يوجد حساب"
      if (res.isSuccess === false) {
        const msg = (res.message || '').toString().toLowerCase();
        if (msg.includes('not found') || msg.includes('not exists') || msg.includes('غير موجود')) {
          this.errorMessage = 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني. يمكنك التسجيل الآن.';
        } else {
          // عرض نص الخطأ القادم من الباك
          this.errorMessage = res.message || 'فشل الإرسال. حاول مرة أخرى.';
        }
        return;
      }

      // حالة غير متوقعة: عرض رسالة عامة
      this.errorMessage = 'استجابة غير متوقعة من الخادم.';
    });
  }
}
