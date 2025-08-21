import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthApiService } from '../../shared/services/auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReaderGuard implements CanActivate {
  
  constructor(
    private authService: AuthApiService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Allow access to blog pages without login
    return true;
  }
}