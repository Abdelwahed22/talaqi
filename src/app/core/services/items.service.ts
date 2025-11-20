// src/app/core/services/lost-items.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LostItemsService {
  private base = `${environment.apiUrl}/api/LostItems`;

  constructor(private http: HttpClient) {}

  getLostItems(pageNumber: number = 1, pageSize: number = 10, category?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', String(pageNumber))
      .set('pageSize', String(pageSize));
    if (category && category !== 'all') params = params.set('category', category);
    return this.http.get<any>(this.base, { params, observe: 'body' });
  }

  // لو عايز POST / Create
  createLostItem(payload: any) {
    return this.http.post<any>(this.base, payload);
  }
}
