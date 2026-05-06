import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <nav class="navbar" *ngIf="authService.user$ | async as user">
      <div class="container nav-container">
        <a routerLink="/" class="logo">TravelTech</a>
        <div class="nav-links">
          <a routerLink="/planner" routerLinkActive="active">Planner</a>
          <div class="profile-menu">
            <div class="profile-circle" (click)="toggleMenu()">
              {{ user.name ? user.name[0].toUpperCase() : 'U' }}
            </div>
            <div class="dropdown-menu glass-card" *ngIf="menuOpen">
              <div class="user-info">
                <strong>{{ user.name }}</strong>
                <span>{{ user.email }}</span>
              </div>
              <hr>
              <button class="logout-btn-dropdown" (click)="logout()">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar { background: var(--bg-secondary); border-bottom: 1px solid var(--glass-border); padding: 1rem 0; }
    .nav-container { display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; }
    .logo { font-size: 1.5rem; font-weight: 800; color: var(--accent-primary); text-decoration: none; }
    .nav-links { display: flex; gap: 2rem; align-items: center; }
    .nav-links a { text-decoration: none; color: var(--text-secondary); font-weight: 500; font-size: 0.95rem; }
    .nav-links a.active { color: var(--accent-primary); }
    
    .profile-menu { position: relative; }
    .profile-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--accent-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
      transition: transform 0.2s;
    }
    .profile-circle:hover { transform: scale(1.05); }
    
    .dropdown-menu {
      position: absolute;
      top: 120%;
      right: 0;
      width: 200px;
      padding: 1rem;
      z-index: 100;
      border: 1px solid var(--glass-border);
      animation: fadeIn 0.2s ease-out;
    }
    .user-info { margin-bottom: 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; }
    .user-info strong { font-size: 0.9rem; color: var(--text-primary); }
    .user-info span { font-size: 0.75rem; color: var(--text-secondary); }
    hr { border: 0; border-top: 1px solid var(--glass-border); margin: 0.5rem 0; }
    
    .logout-btn-dropdown {
      width: 100%;
      background: none;
      border: none;
      color: var(--danger);
      font-size: 0.875rem;
      font-weight: 600;
      text-align: left;
      padding: 0.5rem 0;
      cursor: pointer;
    }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

    main { min-height: calc(100vh - 65px); }
  `]
})
export class App {
  authService = inject(AuthService);
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.menuOpen = false;
    this.authService.logout();
  }
}
