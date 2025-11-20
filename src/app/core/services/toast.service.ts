// toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMsg { id: string; type: 'success'|'error'|'info'; text: string; timeout?: number; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private subject = new BehaviorSubject<ToastMsg[]>([]);
  public toasts$ = this.subject.asObservable();

  push(text: string, type: ToastMsg['type']='info', timeout=3500) {
    const t: ToastMsg = { id: Math.random().toString(36).slice(2), type, text, timeout };
    const current = this.subject.value.slice();
    current.push(t);
    this.subject.next(current);
    if (timeout > 0) {
      setTimeout(() => this.remove(t.id), timeout);
    }
  }

  remove(id: string) {
    this.subject.next(this.subject.value.filter(x=>x.id!==id));
  }
}
