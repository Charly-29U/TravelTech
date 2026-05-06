import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="glass-card auth-card">
        <h2>TravelTech</h2>
        <p class="subtitle">Sign in to your corporate account</p>
        
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" [(ngModel)]="credentials.email" placeholder="name@company.com" autocomplete="email" required>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <div class="password-container">
              <input [type]="showPassword ? 'text' : 'password'" name="password" [(ngModel)]="credentials.password" placeholder="••••••••" autocomplete="current-password" required>
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword" tabindex="-1">
                <svg *ngIf="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg *ngIf="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </button>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
            {{ loading ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>
        
        <p class="footer-text">
          Don't have an account? <a routerLink="/auth/register">Request access</a>
        </p>

        <div *ngIf="error" class="error-msg">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: radial-gradient(circle at top right, #1e293b, #0f172a);
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    h2 { margin-bottom: 0.5rem; color: var(--accent-primary); letter-spacing: -1px; font-size: 2rem; }
    .subtitle { color: var(--text-secondary); margin-bottom: 2rem; }
    .w-full { width: 100%; justify-content: center; }
    .footer-text { margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-secondary); }
    a { color: var(--accent-primary); text-decoration: none; font-weight: 600; }
    .error-msg { margin-top: 1rem; color: var(--danger); font-size: 0.875rem; }
    
    .password-container { position: relative; display: flex; align-items: center; }
    .password-container input { width: 100%; padding-right: 2.5rem; }
    .toggle-password {
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0;
      display: flex;
    }
    .toggle-password svg { width: 20px; height: 20px; transition: color 0.2s; }
    .toggle-password:hover svg { color: var(--accent-primary); }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = { email: '', password: '' };
  loading = false;
  error = '';
  showPassword = false;

  onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.error = 'Invalid credentials or server error';
        this.loading = false;
      }
    });
  }
}
