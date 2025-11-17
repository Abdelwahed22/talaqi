// src/app/pages/profile/edit.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AppNavbar } from '../../shared/navbar/navbar';
import { environment } from '../../../environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppNavbar,RouterModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class ProfileEditPage implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(public fb: FormBuilder, public http: HttpClient, public router: Router) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;

    this.form = this.fb.group({
      firstName: [user?.firstName || '', Validators.required],
      lastName: [user?.lastName || '', Validators.required],
      phoneNumber: [user?.phoneNumber || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const token = localStorage.getItem('accessToken') || '';

    // نرسل البينات للباك (PUT /Users/profile)
    this.http.put(`${environment.apiUrl}/Users/profile`, this.form.value, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(finalize(()=> this.loading = false)).subscribe({
      next: (res: any) => {
        this.success = res?.message || 'تم التحديث';
        // حدث localStorage (لو الباك رجع البيانات الجديدة يمكنك استخدام res.data)
        if (res?.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
        setTimeout(() => this.router.navigate(['/profile']), 800);
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'فشل أثناء التحديث';
      }
    });
  }
}
