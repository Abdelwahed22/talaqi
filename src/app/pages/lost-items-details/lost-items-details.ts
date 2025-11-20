// src/app/pages/lost-item-detail/lost-item-detail.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LostItemsService } from '../../core/services/lost-items.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-lost-item-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lost-items-details.html',
  styleUrls: ['./lost-items-details.css']
  
})
export class LostItemDetail {
  loading = signal(true);
  error = signal<string | null>(null);
  item: any = null;

  constructor(private route: ActivatedRoute, private svc: LostItemsService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('معرّف العنصر غير موجود');
      this.loading.set(false);
      return;
    }

    this.svc.getLostItemById(id)
      .pipe(
        catchError(err => {
          console.error('getLostItemById error', err);
          this.error.set(err?.error?.message ?? 'حدث خطأ أثناء جلب تفاصيل العنصر');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((res: any) => {
        if (!res) return;
        // API قد يرجع الشكل { isSuccess, data } أو يرجع كائن مباشر
        if (res.isSuccess) {
          this.item = res.data ?? null;
        } else if (res.data) {
          this.item = res.data;
        } else if (res.id || res.title) {
          this.item = res; // استجابة مباشرة
        } else {
          this.error.set(res.message ?? 'لم يتم العثور على العنصر');
        }
      });
  }

  onImgError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/assets/img/placeholder-item.png';
}


  formatDate(d?: string) { return d ? new Date(d).toLocaleString() : ''; }

  contactLink() {
    if (!this.item?.contactInfo) return '';
    const num = this.item.contactInfo;
    if (/^\+?\d+$/.test(num)) return `tel:${num}`;
    return '';
  }
}
