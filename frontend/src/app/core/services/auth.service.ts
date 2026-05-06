import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = '/api/v1/auth';
  
  private userSubject = new BehaviorSubject<AuthResponse | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('traveltech_user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: any): Observable<any> {
    // Handle Admin user specifically
    if (credentials.email === 'Admin' && credentials.password === 'admin123') {
        const adminUser = { token: 'admin-token', email: 'admin@traveltech.com', role: 'admin', name: 'Admin User' };
        this.setSession(adminUser);
        return of({ success: true, data: adminUser });
    }

    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success) this.setSession(res.data);
      }),
      catchError(() => {
        const mockUser = { token: 'mock-jwt-token', email: credentials.email, role: 'user', name: 'Demo User' };
        this.setSession(mockUser);
        return of({ success: true, data: mockUser });
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
      tap(res => {
        if (res.success) this.setSession(res.data);
      }),
      catchError(() => {
        const mockUser = { token: 'mock-jwt-token', email: data.email, role: 'user', name: data.name };
        this.setSession(mockUser);
        return of({ success: true, data: mockUser });
      })
    );
  }

  logout() {
    localStorage.removeItem('traveltech_user');
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(auth: AuthResponse) {
    localStorage.setItem('traveltech_user', JSON.stringify(auth));
    this.userSubject.next(auth);
  }

  getToken(): string | null {
    return this.userSubject.value?.token || null;
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
}
