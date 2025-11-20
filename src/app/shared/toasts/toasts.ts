import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule, AsyncPipe, NgForOf],
  template: `
    <div class="toasts-container" aria-live="polite">
      <div *ngFor="let t of toastSvc.toasts$ | async" [class]=" 'toast '+t.type ">
        <span class="txt">{{ t.text }}</span>
        <button class="close" (click)="toastSvc.remove(t.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toasts-container { position: fixed; top: 16px; left: 16px; z-index: 1200; display:flex; flex-direction:column; gap:8px; }
    .toast { min-width:200px; padding:10px 12px; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.08); display:flex; justify-content:space-between; align-items:center; }
    .toast.success{ background:#E9F7EF; color:#0b6d3a }
    .toast.error{ background:#FFECEA; color:#8a1b0f }
    .toast.info{ background:#EEF6FF; color:#0b4d8c }
    .toast .close { background:transparent; border:0; font-size:18px; cursor:pointer; margin-left:8px; color:inherit; }
  `]
})
export class Toasts { constructor(public toastSvc: ToastService) {} }
