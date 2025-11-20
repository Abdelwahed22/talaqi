// src/app/pages/lost-items/lost-items.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LostItemsService } from '../../core/services/lost-items.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppNavbar } from '../../shared/navbar/navbar';

// واجهة مبسطة - عدّل الحقول لو عندك أنواع أقوى في المشروع
export interface LostItem {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  imageUrl?: string | null;
  createdAt?: string;
  dateLost?: string;
  dateFound?: string;
  status?: string;
  isFound?: boolean;
  location?: { address?: string };
}

@Component({
  selector: 'app-lost-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AppNavbar],
  templateUrl: './lost-items.html',
  styleUrls: ['./lost-items.css']
})
export class LostItems {
  public math = Math;

  loading = signal(false);
  error = signal<string | null>(null);

  items: LostItem[] = [];
  rawItems: LostItem[] = [];
  total = 0;
  pageNumber = 1;
  pageSize = 20;

  defaultPageSize = 20;
  searchPageSize = 200;

  public categoryOptions = [
    { label: 'الكل', value: 'all' },
    { label: 'حيوانات أليفة', value: 'Pets' },
    { label: 'ممتلكات شخصية', value: 'PersonalBelongings' },
    { label: 'أشخاص', value: 'People' }
  ];

  form!: FormGroup;

  constructor(private fb: FormBuilder, private svc: LostItemsService) {
    this.form = this.fb.group({
      category: ['all'],
      q: ['']
    });
  }

  get categoryControl(): FormControl {
    return this.form.get('category') as FormControl;
  }
  get qControl(): FormControl {
    return this.form.get('q') as FormControl;
  }

  ngOnInit() {
    // إذا فيه q في الـ querystring نعرضها
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) this.qControl.setValue(decodeURIComponent(q));
    this.loadPage(1);
  }

  loadPage(page: number = 1) {
    this.pageNumber = page;
    this.loading.set(true);
    this.error.set(null);

    const selectedCategory = (this.categoryControl.value ?? 'all') as string;
    const categoryParam = (selectedCategory && selectedCategory !== 'all') ? selectedCategory : undefined;

    const q = (this.qControl.value || '').toString().trim();
    const pageSizeToUse = q ? this.searchPageSize : this.defaultPageSize;

    // لوج للمساعدة بالـ debug
    console.log('[LostItems] loadPage', { page, categoryParam, q, pageSizeToUse });

    this.svc.getLostItems(this.pageNumber, pageSizeToUse, categoryParam)
      .pipe(
        catchError(err => {
          console.error('LostItems GET error', err);
          this.error.set(err?.error?.message ?? `حدث خطأ أثناء تحميل العناصر (رمز: ${err?.status ?? 'unknown'})`);
          this.rawItems = [];
          this.items = [];
          this.total = 0;
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe(res => {
        if (!res) return;
        const payload = res as any;

        if (payload && typeof payload === 'object' && 'isSuccess' in payload) {
          if (!payload.isSuccess) {
            this.error.set(payload.message ?? 'فشل استرجاع العناصر من الخادم');
            this.rawItems = [];
            this.items = [];
            this.total = 0;
            return;
          }

          const data = payload.data ?? {};
          if (Array.isArray(data.items)) {
            this.rawItems = data.items;
            this.total = (data.totalCount ?? data.total ?? this.rawItems.length) as number;
            this.pageNumber = data.pageNumber ?? this.pageNumber;
            this.pageSize = data.pageSize ?? this.pageSize;
          } else if (Array.isArray(data)) {
            this.rawItems = data;
            this.total = this.rawItems.length;
          } else {
            this.rawItems = [];
            this.total = 0;
          }
        } else if (Array.isArray(payload)) {
          this.rawItems = payload;
          this.total = payload.length;
        } else {
          this.rawItems = [];
          this.total = 0;
        }

        // بعد ما نستقبل البيانات نطبّق فلتر محلي صارم حسب الفئة والنص
        this.applyLocalFilter(q, selectedCategory);
      });
  }

  applyLocalFilter(q?: string, selectedCategory?: string) {
    const query = (q ?? this.qControl.value ?? '').toString().trim().toLowerCase();

    let filtered = [...this.rawItems];

    // فلترة صارمة على الفئة — لن يعرض إلا العناصر التي category لها يساوي الفئة المطلوبة
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(it => {
        const cat = (it?.category ?? '').toString();
        return cat.toLowerCase() === (selectedCategory ?? '').toLowerCase();
      });
    }

    // فلترة نصية داخل العنوان والوصف والفئة والعنوان
    if (query) {
      filtered = filtered.filter(it => {
        const title = (it?.title ?? '').toString().toLowerCase();
        const desc = (it?.description ?? '').toString().toLowerCase();
        const category = (it?.category ?? '').toString().toLowerCase();
        const address = (it?.location?.address ?? '').toString().toLowerCase();
        return title.includes(query) || desc.includes(query) || category.includes(query) || address.includes(query);
      });
    }

    this.items = filtered;
  }

  // Helper: اعطنا رابط صورة صالح دائماً
  imageFor(item: LostItem): string {
    if (!item) return '/assets/img/placeholder-item.png';
    const url = item.imageUrl ?? '';
    if (!url || url === 'null') return '/assets/img/placeholder-item.png';
    return url;
  }

  // Handler for broken images
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement | null;
    if (img) img.src = '/assets/img/placeholder-item.png';
  }

  // Helper: هل العنصر مُعَلَن عنه كـ Found؟
  isFound(item: LostItem): boolean {
    return Boolean(
      item &&
      (
        item.status === 'Found' ||
        item.status === 'Closed' ||
        item.isFound === true
      )
    );
  }

  onSearchButtonClicked() {
    this.loadPage(1);
  }

  onCategoryChanged() {
    this.loadPage(1);
  }

  nextPage() {
    const lastPage = Math.ceil(this.total / this.pageSize);
    if (this.pageNumber < lastPage) this.loadPage(this.pageNumber + 1);
  }

  prevPage() {
    if (this.pageNumber > 1) this.loadPage(this.pageNumber - 1);
  }

  formatDate(date?: string) {
    return date ? new Date(date).toLocaleString() : '';
  }
}
