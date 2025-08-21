import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../public/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private apiUrl = `${environment.URL}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  private isBrowser: boolean;
  private useMockData = true; // Set to true to use mock data instead of API
  
  // In-memory storage for server-side rendering
  private memoryToken: string | null = null;
  private memoryUser: any = null;

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Login user
  login(credentials: any): Observable<any> {
    if (this.useMockData) {
      return this.mockDataService.login(credentials)
        .pipe(
          tap((response: any) => {
            if (response.token) {
              this.setToken(response.token);
              this.setUser(response.user);
            }
          })
        );
    }
    
    return this.http.post(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response: any) => {
          if (response.token) {
            this.setToken(response.token);
            this.setUser(response.user);
          }
        }),
        catchError(() => this.mockDataService.login(credentials)
          .pipe(
            tap((response: any) => {
              if (response.token) {
                this.setToken(response.token);
                this.setUser(response.user);
              }
            })
          )
        )
      );
  }

  // Logout user
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.memoryToken = null;
    this.memoryUser = null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getUser();
    return this.isLoggedIn() && user && user.role === 'admin';
  }

  // Get authentication token
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return this.memoryToken;
  }

  // Set authentication token
  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
    this.memoryToken = token;
  }

  // Get user data
  getUser(): any {
    if (this.isBrowser) {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    }
    return this.memoryUser;
  }

  // Set user data
  private setUser(user: any): void {
    if (this.isBrowser) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.memoryUser = user;
  }
}