import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { NavService } from '../../shared/services/nav.service';
import { GetUserDetails } from '../../shared/action/account.action';
import { GetNotification } from '../../shared/action/notification.action';
import { GetBadges } from '../../shared/action/menu.action';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private store: Store,
    private router: Router,
    private navService: NavService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    
    return this.checkAuthStatus().pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return of(true);
        } else {
          return of(this.router.createUrlTree(['/auth/login']));
        }
      })
    );
  }

  canActivateChild(): Observable<boolean> | boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    
    return of(true);
  }

  private checkAuthStatus(): Observable<boolean> {
    // Check localStorage first
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      return of(true);
    }
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('access_token', urlToken);
      return of(true);
    }
    
    return this.store.select(state => !!state.auth?.access_token).pipe(
      map(access_token => !!access_token), // Convert to boolean
      catchError(() => of(false)) // Handle errors, e.g., when access_token is not available
    );
  }

  private initializeData(): void {
    this.navService.sidebarLoading = true;
    this.store.dispatch(new GetBadges());
    this.store.dispatch(new GetNotification());
    this.store.dispatch(new GetUserDetails()).subscribe({
      complete: () => {
        this.navService.sidebarLoading = false;
      },
    });
  }
}
