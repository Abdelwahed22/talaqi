// src/app/shared/navbar/navbar.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class AppNavbar implements OnInit, OnDestroy {
  user: any = null;
  private userSubscription: Subscription | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    console.log('[Navbar] ngOnInit - subscribing to currentUser$');
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      console.log('[Navbar] user updated:', user);
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout() {
    console.log('[Navbar] logout clicked');
    this.authService.logout();
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }
}
