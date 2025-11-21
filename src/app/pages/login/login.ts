import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AppNavbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RouterLink ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  // لا تهيئ الفورم هنا — فقط عرف المتغيّر
  form!: FormGroup;

  loading = false;
  error = '';
  private returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    // هيئ الفورم داخل الconstructor بعد أن يكون fb موجود
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    const q = this.route.snapshot.queryParams['returnUrl'];
    if (q && typeof q === 'string') this.returnUrl = q;
  }

  onSubmit() {
    console.log('onSubmit called');
    this.error = '';

    if (this.form.invalid) {
      console.log('form invalid', this.form.value);
      this.form.markAllAsTouched();
      return;
    }

    // Extract values from form
    const credentials = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    };

    this.loading = true;
    this.auth.login(credentials)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe({
        next: (res) => {
          console.log('login response:', res);
          if (res.isSuccess) {
            this.router.navigate(['/homeafterregister']).catch(err => console.error('nav error', err));
          } else {
            this.error = res.message || 'Login failed';
          }
        },
        error: (err) => {
          console.error('login http error', err);
          this.error = this.parseBackendError(err);
        }
      });
  }

  private parseBackendError(err: any): string {
    if (!err) return 'حدث خطأ غير معروف';
    if (err.status === 0) return 'لا يمكن الوصول إلى الخادم. تحقق من تشغيل الباك أو CORS.';
    const body = err.error;
    if (body) {
      if (body.message) return body.message;
      if (body.errors) return Array.isArray(body.errors) ? body.errors.join(' - ') : JSON.stringify(body.errors);
      if (typeof body === 'string') return body;
    }
    return err.message || JSON.stringify(err);
  }
}
