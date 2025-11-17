// src/app/pages/profile/profile.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AppNavbar } from '../../shared/navbar/navbar';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, AppNavbar , RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfilePage implements OnInit {

  user: any = null;
  loading = true;
  error = '';

constructor(private http: HttpClient, private router: Router) {}

  // ثم أضف:
onEdit() {
  this.router.navigate(['/profile/edit']);
}
  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.error = "أنت غير مسجّل الدخول.";
      this.loading = false;
      return;
    }

    // نجيب بيانات اليوزر من API الحقيقي
    this.http.get(`${environment.apiUrl}/Users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.user = res.data || res || null;

        // تحديث localStorage لو لزم
        if (this.user) {
          localStorage.setItem('user', JSON.stringify(this.user));
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.error = "حدث خطأ أثناء تحميل البيانات.";
      }
    });
  }
}
