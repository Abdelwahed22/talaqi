// src/app/pages/profile/profile.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { finalize } from 'rxjs/operators';
import { AppNavbar } from "../../shared/navbar/navbar";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, AppNavbar, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfilePage implements OnInit {
  user: any = null;
  loading = true;
  error = '';

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    // عرض أسرع: قراءة من AuthService (BehaviorSubject) أو localStorage أولاً
    const s = this.auth.currentUser$;
    const maybe = (localStorage.getItem('user'));
    if (maybe) this.user = JSON.parse(maybe);
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.error = '';
    // نستخدم AuthInterceptor لذلك لا نحتاج لإضافة header يدوياً
    this.http.get<any>(`${environment.apiUrl}/Users/profile`).pipe(finalize(() => this.loading = false)).subscribe({
      next: (res) => {
        const data = res?.data ?? res;
        if (!data) { this.error = 'لم يتم العثور على بيانات المستخدم'; return; }
        this.user = data;
        // cache-bust: لو الصورة من الباك، أضف version param لتحديث الواجهة فوراً
        if (this.user?.profilePictureUrl) {
          this.user.profilePictureUrl = this.addCacheBuster(this.user.profilePictureUrl);
        }
        this.auth.setCurrentUser(this.user);
        localStorage.setItem('user', JSON.stringify(this.user));
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'حدث خطأ أثناء تحميل البيانات.';
      }
    });
  }

  goEdit() { this.router.navigate(['/profile/edit']); }
  logout() { this.auth.logout(); }

  triggerFileInput() {
    try { this.fileInput.nativeElement.click(); } catch {}
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if (!f) return;
    this.uploadProfilePicture(f);
  }

  uploadProfilePicture(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    this.http.post<any>(`${environment.apiUrl}/Users/profile-picture`, fd).subscribe({
      next: (res) => {
        const raw = res?.imageUrl ?? res?.data?.imageUrl;
        if (raw) {
          const newUrl = this.addCacheBuster(raw);
          this.user = { ...(this.user || {}), profilePictureUrl: newUrl };
          this.auth.setCurrentUser(this.user);
          localStorage.setItem('user', JSON.stringify(this.user));
          // هنا استخدم toast بدلاً من alert
        }
      },
      error: (err) => {
        console.error(err);
        // هنا toast error
      }
    });
  }

  addCacheBuster(url: string) {
    return url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now();
  }

  shortId(id?: string) {
    if (!id) return '—';
    if (id.length <= 12) return id;
    return `${id.slice(0,8)}…${id.slice(-4)}`;
  }

  copyId(id?: string) {
    if (!id) return;
    navigator.clipboard?.writeText(id).then(() => console.log('Copied id')).catch(() => {});
  }
}
