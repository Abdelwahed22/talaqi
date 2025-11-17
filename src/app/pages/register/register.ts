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
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppNavbar } from '../../shared/navbar/navbar';
import { catchError, of } from 'rxjs';
// import { of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';





@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule, AppNavbar],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  form: FormGroup;
  loading = false;
  error = '';

  // غيّره حسب بيئتك لو لازم
  private apiBase = 'https://api.talaqi.com/api';

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

//   onSubmit(): void {
//   this.error = '';

//   // تحقق محلي أولاً
//   if (this.form.invalid) {
//     this.form.markAllAsTouched();
//     return;
//   }

//   // جهّز الحمولة طبقاً لوثيقة الـ API (AuthController -> register)
//   const payload = {
//     firstName: this.f['firstName'].value,
//     lastName: this.f['lastName'].value,
//     email: this.f['email'].value,
//     phoneNumber: this.f['phoneNumber'].value,
//     password: this.f['password'].value,
//     confirmPassword: this.f['confirmPassword'].value
//   };

//   this.loading = true;

//   this.http.post<any>(`${this.apiBase}/Auth/register`, payload).pipe(
//     // عند الانتهاء من الـ observable (ناجح أو فشل) نوقف التحميل
//     finalize(() => { this.loading = false; }),
//     // نلتقط أخطاء الشبكة/السيرفر لمعالجتها مكانياً قبل الاشتراك
//     catchError(err => {
//       // نحلل الخطأ ونضع رسالة مفهومة في this.error
//       this.error = this.parseBackendError(err);
//       // نعيد Observable بقيمة null حتى لا يكسر الاشتراك
//       return of(null);
//     })
//   ).subscribe(res => {
//     // لو الـ observable عاد null (بسبب خطأ) نخرج
//     if (!res) return;

//     // حسب وثيقة الـ API الاستجابة تكون على شكل { isSuccess: boolean, message: string, data: ... }
//     if (res.isSuccess === true || (res.data && res.data.accessToken)) {
//       // تسجيل ناجح — نوجّه المستخدم إلى صفحة تسجيل الدخول
//       this.router.navigate(['/login']);
//     } else {
//       // ربما رجع isSuccess=false مع رسالة أو أخطاء
//       // نحاول عرض أفضل رسالة ممكنة
//       if (res.message) {
//         this.error = res.message;
//       } else if (res.errors) {
//         // errors قد تكون array أو object (validation model state)
//         if (Array.isArray(res.errors)) {
//           this.error = (res.errors as string[]).join(' - ');
//         } else {
//           this.error = JSON.stringify(res.errors);
//         }
//       } else {
//         this.error = 'فشل التسجيل — حاول لاحقًا';
//       }
//     }
//   });
// }

// /**
//  * parseBackendError: يحاول استخراج رسالة خطأ صالحة للمستخدم
//  * يتعامل مع:
//  * - أخطاء الشبكة (status 0 => DNS / connection)
//  * - استجابات JSON مع error.message أو error.errors
//  * - حالات أخرى (HTTP status codes)
//  */
// private parseBackendError(err: any): string {
//   try {
//     // لو لا اتصال بالشبكة أو DNS fail (ERR_NAME_NOT_RESOLVED) => status 0
//     if (err?.status === 0) {
//       return 'لا يمكن الوصول إلى الخادم. تحقق من اتصالك أو عنوان الـ API (ERR_NAME_NOT_RESOLVED).';
//     }

//     // إذا الرجوع من السيرفر بصيغة JSON
//     const body = err?.error;

//     if (!body) {
//       // ربما رسالة عامة من الـ HttpClient
//       return err?.message || 'حدث خطأ غير متوقع أثناء الاتصال بالخادم.';
//     }

//     // لو السيرفر رد بصيغة متوقعة { isSuccess:false, message: "...", errors: [...] }
//     if (typeof body === 'object') {
//       if (body.message) return body.message;
//       if (body.errors) {
//         if (Array.isArray(body.errors)) return body.errors.join(' - ');
//         // errors قد تكون كائن (مثل ModelState)
//         return JSON.stringify(body.errors);
//       }
//     }

//     // لو body نصي
//     if (typeof body === 'string') return body;

//     // fallback عام
//     return 'حدث خطأ في الخادم. حاول مرة أخرى.';
//   } catch (e) {
//     console.error('Error parsing backend error', e, err);
//     return 'فشل في معالجة خطأ السيرفر.';
//   }
// }


  // ==========================MMMMMMMMOOOOOOKKKKKKKKKKK==========================
  onSubmit() {
  this.error = '';

  // تحقق من صحة الفورم أولاً
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  // === MOCK: محاكاة طلب تسجيل للمقاصد المحلية فقط ===
  // هذا سيمكنك من اختبار الـ redirect بدون الاتصال بالباك
  this.loading = true;
  of({ success: true }).pipe(delay(600)).subscribe({
    next: (res) => {
      this.loading = false;
      console.log('Mock register result:', res);
      // التوجيه لصفحة تسجيل الدخول
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.loading = false;
      console.error('Mock register error:', err);
      this.error = 'حدث خطأ أثناء التسجيل (mock)';
    }
  });
}

}
