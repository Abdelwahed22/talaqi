// src/app/core/services/lost-items.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LostItemsService {
  // تأكد أن environment.apiUrl ليس بنهاية "/"، ثم نلصق "/api/LostItems"
  private baseUrl = (environment.apiUrl || 'https://localhost:7282').replace(/\/+$/, '');
  private endpoint = `${this.baseUrl}/api/LostItems`;

  constructor(private http: HttpClient) {}

  getLostItems(pageNumber = 1, pageSize = 10, category?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', String(pageNumber))
      .set('pageSize', String(pageSize));

    if (category && category !== 'all') {
      params = params.set('category', category);
    }

    console.log('[LostItemsService] GET', this.endpoint, params.toString());

    return this.http.get<any>(this.endpoint, { params });
  }

  // NEW: جلب عنصر واحد بالتفاصيل حسب id
  getLostItemById(id: string): Observable<any> {
    const url = `${this.endpoint}/${id}`;
    console.log('[LostItemsService] GET by id', url);
    return this.http.get<any>(url);
  }

  // (اختياري لاحقًا) دوال CRUD إضافية: create, update, delete يمكن إضافتها هنا
}
