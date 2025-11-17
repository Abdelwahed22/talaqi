// src/app/shared/navbar/navbar.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class AppNavbar implements OnInit, OnDestroy {
  user: any = null;
  private onStorage = (e: StorageEvent) => this.handleStorageEvent(e);

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Debug log
    console.log('[Navbar] ngOnInit - reading localStorage user');

    this.loadUser();

    // listen to storage events (useful if you clear storage in another tab)
    window.addEventListener('storage', this.onStorage);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.onStorage);
  }

  private handleStorageEvent(e: StorageEvent) {
    if (e.key === 'user' || e.key === 'accessToken' || e.key === null) {
      console.log('[Navbar] storage event', e.key, e.newValue);
      this.loadUser();
    }
  }

  private loadUser() {
    try {
      const raw = localStorage.getItem('user');
      console.log('[Navbar] loadUser raw=', raw);
      this.user = raw ? JSON.parse(raw) : null;
      // extra check: if no user but accessToken exists, log it
      if (!this.user && localStorage.getItem('accessToken')) {
        console.log('[Navbar] accessToken exists but no user object');
      }
    } catch (ex) {
      console.error('[Navbar] loadUser parse error', ex);
      this.user = null;
    }
  }

  logout() {
    console.log('[Navbar] logout clicked - clearing storage');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    // notify other tabs (optional)
    try { localStorage.setItem('logout', Date.now().toString()); } catch {}
    this.user = null;
    this.router.navigate(['/login']);
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }
}
