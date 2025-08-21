import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthClear } from '../../shared/action/auth.action';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private store: Store,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {

    let token = this.store.selectSnapshot(state => state.auth.access_token);
    
    // Fallback to localStorage if token not in store (browser only)
    if (!token && isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('access_token');
    }
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notificationService.notification = false;
          this.store.dispatch(new AuthClear());
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
  
}
