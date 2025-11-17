import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('[MockInterceptor] intercept', req.method, req.url); // << للتأكيد على أنه يُستدعى
    const { method, url } = req;

    if (url?.includes('/api/Auth/')) {
      const fakeDelay = 600;

      //   if (url.endsWith('/Auth/forgot-password') && method === 'POST') {
      //     const body = { isSuccess: true, message: 'رمز التحقق تم إرساله إلى بريدك الإلكتروني', data: null };
      //     return of(new HttpResponse({ status: 200, body })).pipe(delay(fakeDelay));
      //   }

      // MockInterceptor (جزء forgot-password)
      if (url.endsWith('/Auth/forgot-password') && method === 'POST') {
        // يمكنك توليد كود عشوائي لو حابب
        const fakeCode = Math.floor(100000 + Math.random() * 900000).toString(); // e.g. "483920"
        const body = {
          isSuccess: true,
          message: 'رمز التحقق تم إرساله إلى بريدك الإلكتروني (mock).',
          data: { code: fakeCode },
        };
        return of(new HttpResponse({ status: 200, body })).pipe(delay(fakeDelay));
      }

      if (url.endsWith('/Auth/reset-password') && method === 'POST') {
        const body = { isSuccess: true, message: 'تمت إعادة تعيين كلمة المرور بنجاح', data: null };
        return of(new HttpResponse({ status: 200, body })).pipe(delay(fakeDelay));
      }

      // ... بقية الـ mocks
      const body = {
        isSuccess: false,
        message: 'Mock: endpoint not implemented in MockInterceptor',
        errors: [],
      };
      return of(new HttpResponse({ status: 400, body })).pipe(delay(fakeDelay));
    }

    return next.handle(req);
  }
}
