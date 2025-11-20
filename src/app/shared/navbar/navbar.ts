// src/app/shared/navbar/navbar.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, AppUser } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class AppNavbar implements OnInit, OnDestroy {
  user: AppUser | null = null;
  dropdownOpen = false;

  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef<HTMLInputElement>;

  private subs = new Subscription();

  constructor(private router: Router, private auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    console.log('[Navbar] init - loading user from storage');
    this.loadUser();

    // subscribe to auth changes if available
    this.subs.add(
      this.auth.currentUser$.subscribe((u) => {
        if (u) this.user = u;
        else this.loadUser(); // fallback if auth cleared
      })
    );

    // close dropdown on escape
    document.addEventListener('keydown', this.onKeyDown);
    // close on click outside
    document.addEventListener('click', this.onDocClick);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('click', this.onDocClick);
  }

  private loadUser() {
    try {
      const raw = localStorage.getItem('user');
      this.user = raw ? (JSON.parse(raw) as AppUser) : null;
    } catch (ex) {
      console.error('[Navbar] loadUser parse error', ex);
      this.user = null;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goProfile() {
    this.dropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  navigateToEdit() {
    this.dropdownOpen = false;
    this.router.navigate(['/profile/edit']);
  }

  logout() {
    this.dropdownOpen = false;
    this.auth.logout();
  }

  triggerFileInput() {
    this.dropdownOpen = false;
    const el = this.fileInput?.nativeElement;
    if (el) {
      el.value = ''; // reset so change fires even if same file selected
      el.click();
    } else {
      console.warn('[Navbar] file input not ready');
    }
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement | null;
    if (!input) return;
    const file = input.files?.[0];
    if (!file) return;
    this.uploadProfilePicture(file);
  }

  uploadProfilePicture(file: File) {
    console.log('[Navbar] uploading', file.name);

    const fd = new FormData();
    fd.append('file', file);

    // AuthInterceptor should add Authorization header; if not, read token from auth.getToken()
    this.http.post<any>('/api/Users/profile-picture', fd).subscribe({
      next: (res) => {
        console.log('[Navbar] upload response', res);
        const newUrl = res?.imageUrl ?? res?.data?.imageUrl ?? null;
        if (!newUrl) {
          console.warn('[Navbar] upload returned no imageUrl');
          return;
        }
        // تأكد أن this.user موجودة - لو مش موجودة نخرج
        if (!this.user) {
          console.warn('[Navbar] upload succeeded but no current user in memory');
          return;
        }

        // this.user موجودة لذا نقدر نبني AppUser بشكل آمن
        const updatedUser: AppUser = {
          ...this.user, // يحتوي على id، firstName، lastName، email، ...
          profilePictureUrl: newUrl, // نحدّث حقل الصورة فقط
        };

        // حدّث الـ AuthService و localStorage
        this.auth.setCurrentUser(updatedUser);
        this.user = updatedUser;
      },
      error: (err) => {
        console.error('[Navbar] upload error', err);
        // هنا تعرض toast أو رسالة جميلة بدل alert
      },
    });
  }

  // CLOSE dropdown on Escape key
  private onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' && this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  };

  // CLOSE dropdown if clicked outside navbar
  private onDocClick = (ev: MouseEvent) => {
    try {
      const target = ev.target as HTMLElement;
      const root = (document.querySelector('app-navbar') as HTMLElement) ?? null;
      if (!root) return;
      if (!root.contains(target) && this.dropdownOpen) {
        this.dropdownOpen = false;
      }
    } catch (ex) {
      // safe guard
    }
  };
}
