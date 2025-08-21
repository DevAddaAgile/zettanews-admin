import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthApiService } from '../../shared/services/auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthApiService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }
    
    // Redirect to login if not logged in or not admin
    this.router.navigate(['/auth/login']);
    return false;
  }
}