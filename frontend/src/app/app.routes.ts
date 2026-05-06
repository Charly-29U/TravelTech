import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { PlannerComponent } from './features/planner/planner.component';
import { ItineraryDetailComponent } from './features/itinerary-detail/itinerary-detail.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'auth/login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'auth/register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'planner', component: PlannerComponent, canActivate: [authGuard] },
  { path: 'itineraries/:id', component: ItineraryDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
