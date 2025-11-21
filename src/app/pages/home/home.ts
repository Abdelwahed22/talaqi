import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  q = '';
  category = '';

  constructor(private router: Router) {}

  private ensureAuthOrRedirect(target: string) {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('talaqi_access_token') || localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    this.router.navigate([target]);
    return true;
  }

  onSearchClick() {
    // لو مش متسجل يروح لصفحة login، لو متسجل يروح لصفحة lost-items
    const token = localStorage.getItem('accessToken') || localStorage.getItem('talaqi_access_token') || localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/lost-items']);
    }
  }

  onAssistClick() {
    // توجيه مشابه (يمكن تغييره لصفحة report/announce)
    this.onSearchClick();
  }

  onSearchSubmit() {
    // نمرر الـ query في عنوان URL حتى صفحة lost-items تستقبلها
    const params: any = {};
    if (this.q) params.q = this.q;
    if (this.category) params.category = this.category;
    const url = ['/lost-items'];
    this.router.navigate(url, { queryParams: params });
  }
}
