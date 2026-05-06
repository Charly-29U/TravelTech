import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="glass-card auth-card">
        <h2>TravelTech</h2>
        <p class="subtitle">Create your corporate account</p>
        
        <form (ngSubmit)="onRegister()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" name="name" [(ngModel)]="data.name" placeholder="John Doe" autocomplete="name" required>
          </div>

          <div class="form-group">
            <label>Username</label>
            <input type="text" name="username" [(ngModel)]="data.username" placeholder="johndoe123" autocomplete="username" required>
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" [(ngModel)]="data.email" placeholder="name@company.com" autocomplete="email" required>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <div class="password-container">
              <input [type]="showPassword ? 'text' : 'password'" name="password" [(ngModel)]="data.password" (input)="checkStrength()" placeholder="••••••••" autocomplete="new-password" required>
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword" tabindex="-1">
                <svg *ngIf="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg *ngIf="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </button>
            </div>
            <div class="strength-meter">
              <div class="strength-bar" [style.width]="strength + '%'" [class]="strengthClass"></div>
            </div>
            <span class="strength-label" *ngIf="data.password">{{ strengthText }}</span>
          </div>
          
          <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
        
        <p class="footer-text">
          Already have an account? <a routerLink="/auth/login">Sign in</a>
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

    .strength-meter {
      height: 4px;
      background: rgba(255,255,255,0.1);
      margin-top: 0.5rem;
      border-radius: 2px;
      overflow: hidden;
    }
    .strength-bar {
      height: 100%;
      transition: all 0.3s ease;
    }
    .strength-weak { background: var(--danger); }
    .strength-medium { background: #f59e0b; }
    .strength-strong { background: #10b981; }
    .strength-label { font-size: 0.7rem; color: var(--text-secondary); display: block; text-align: left; margin-top: 0.25rem; }
    
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
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  data = { name: '', username: '', email: '', password: '' };
  loading = false;
  error = '';
  showPassword = false;
  strength = 0;
  strengthClass = '';
  strengthText = '';

  checkStrength() {
    const p = this.data.password;
    if (!p) { this.strength = 0; return; }
    
    let score = 0;
    if (p.length > 6) score += 30;
    if (/[A-Z]/.test(p)) score += 20;
    if (/[0-9]/.test(p)) score += 20;
    if (/[^A-Za-z0-9]/.test(p)) score += 30;

    this.strength = score;
    if (score < 40) {
      this.strengthClass = 'strength-weak';
      this.strengthText = 'Débil';
    } else if (score < 80) {
      this.strengthClass = 'strength-medium';
      this.strengthText = 'Media';
    } else {
      this.strengthClass = 'strength-strong';
      this.strengthText = 'Fuerte';
    }
  }

  onRegister() {
    if (!this.data.name || !this.data.username || !this.data.email || !this.data.password) {
      this.error = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.authService.register(this.data).subscribe({
      next: () => this.router.navigate(['/planner']),
      error: err => {
        this.error = 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
