import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { City, CityService } from '../../core/services/city.service';
import { ItineraryService } from '../../core/services/itinerary.service';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <header class="planner-header">
        <h1>Optimize Itinerary</h1>
        <p>Plan your multi-city corporate trip using our global optimization engine.</p>
      </header>

      <div class="planner-grid">
        <!-- Configuration Card -->
        <div class="glass-card config-card">
          <form (ngSubmit)="onOptimize()">
            <!-- Trip Summary Info -->
            <div class="trip-summary glass-card">
              <div class="summary-item">
                <span class="label">Total Trip Duration</span>
                <span class="value">{{ getTotalTripDays() }} Days</span>
              </div>
              <div class="summary-item" [class.error]="getTotalStayDays() > getTotalTripDays()">
                <span class="label">Days Assigned</span>
                <span class="value">{{ getTotalStayDays() }} / {{ getTotalTripDays() }}</span>
              </div>
            </div>

            <div class="row">
              <div class="form-group col">
                <label>Origin Country</label>
                <select name="originCountry" [(ngModel)]="itinerary.originCountry" (change)="onOriginCountryChange()" required>
                  <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
                </select>
              </div>
              <div class="form-group col">
                <label>Origin City</label>
                <select name="origin" [(ngModel)]="itinerary.origin" required>
                  <option *ngFor="let city of filteredOriginCities" [value]="city.name">{{ city.name }}</option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="form-group col">
                <label>Departure Date</label>
                <input type="date" name="startDate" [(ngModel)]="itinerary.startDate" (change)="onDatesChange()" required>
              </div>
              <div class="form-group col-sm">
                <label>Time</label>
                <input type="time" name="startTime" [(ngModel)]="itinerary.startTime">
              </div>
              <div class="form-group col">
                <label>Return Date</label>
                <input type="date" name="returnDate" [(ngModel)]="itinerary.returnDate" (change)="onDatesChange()" required>
              </div>
              <div class="form-group col-sm">
                <label>Time</label>
                <input type="time" name="returnTime" [(ngModel)]="itinerary.returnTime">
              </div>
            </div>

            <div class="form-group">
              <label>Destinations</label>
              <div *ngFor="let dest of itinerary.destinations; let i = index; trackBy: trackByFn" class="destination-row-group glass-card">
                <div class="row">
                  <div class="form-group col">
                    <label>Country</label>
                    <select [name]="'destCountry' + i" [(ngModel)]="dest.country" (change)="onDestCountryChange(i)" required>
                      <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
                    </select>
                  </div>
                  <div class="form-group col">
                    <label>City</label>
                    <select [name]="'destCity' + i" [(ngModel)]="dest.city" required>
                      <option *ngFor="let city of getFilteredDestCities(dest.country)" [value]="city.name">{{ city.name }}</option>
                    </select>
                  </div>
                  <div class="form-group col">
                    <label>Transport</label>
                    <select [name]="'destTransport' + i" [(ngModel)]="dest.transportType" required>
                      <option *ngFor="let type of transportTypes" [value]="type">{{ type }}</option>
                    </select>
                  </div>
                  <div class="form-group col-sm">
                    <label>Stay (Days)</label>
                    <input type="number" [name]="'destStay' + i" [(ngModel)]="dest.stayDays" (ngModelChange)="onStayDaysChange(i)" min="1" required>
                    <div class="stay-dates-hint" *ngIf="itinerary.startDate">
                      {{ getDestDates(i) }}
                    </div>
                  </div>
                  <button type="button" class="btn-icon remove-dest" (click)="removeDestination(i)" *ngIf="itinerary.destinations.length > 1">
                    &times;
                  </button>
                </div>
              </div>
              <button type="button" class="btn-add" (click)="addDestination()">+ Add Destination</button>
            </div>

            <div class="row">
              <div class="form-group col">
                <label>Budget (USD) - Min. 500</label>
                <input type="text" name="budget" [ngModel]="formatNumberWithDots(itinerary.budget)" (ngModelChange)="onBudgetChange($event)" required>
              </div>
              <div class="form-group col">
                <label>Passengers</label>
                <input type="number" name="passengers" [(ngModel)]="itinerary.passengers" min="1" required>
              </div>
              <div class="form-group col">
                <label>Optimization Strategy</label>
                <select name="strategy" [(ngModel)]="itinerary.strategy">
                  <option value="MIN_COST">Min Cost</option>
                  <option value="MIN_TIME">Min Time</option>
                  <option value="BALANCED">Balanced</option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="form-group col">
                <label>Travel Style</label>
                <select name="travelStyle" [(ngModel)]="itinerary.travelStyle">
                  <option value="ECONOMIC">Económico</option>
                  <option value="AVERAGE">Promedio</option>
                  <option value="LUXURY">Costoso</option>
                </select>
              </div>
              <div class="form-group col">
                <label>Estimated Daily Expenses</label>
                <input type="text" [value]="formatCurrency(getEstimatedExpenses())" readonly style="opacity: 0.8; cursor: not-allowed;">
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-full" [disabled]="loading || getTotalStayDays() > getTotalTripDays()">
              {{ loading ? 'Optimizing...' : 'Calculate Best Route' }}
            </button>
          </form>
        </div>

        <!-- Sidebar Alert -->
        <div class="sidebar-alert glass-card" *ngIf="getTotalStayDays() > getTotalTripDays()">
          <div class="alert-content">
            <span class="alert-icon">🚩</span>
            <div class="alert-text">
              <h4>Atención</h4>
              <p>Los días de estancia superan la duración del viaje. Por favor, <strong>cambia las fechas</strong> o <strong>baja los días de estadía</strong>.</p>
            </div>
          </div>
        </div>

        <!-- Preview / Info -->
        <div class="info-card">
          <h3>How it works</h3>
          <ul class="info-list">
            <li><strong>Global Reach:</strong> We calculate distances using real-world coordinates.</li>
            <li><strong>Timezone Aware:</strong> Arrival times are adjusted automatically.</li>
            <li><strong>Smarter Logistics:</strong> Choose between cost, time, or a balanced approach.</li>
          </ul>
          
          <div class="stats-preview" *ngIf="!loading && !result">
            <div class="stat">
              <span class="label">Supported Cities</span>
              <span class="value">{{ allCities.length }}</span>
            </div>
            <div class="stat">
              <span class="label">Transport Modes</span>
              <span class="value">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .planner-header { margin-bottom: 3rem; }
    h1 { font-size: 2.5rem; color: var(--accent-primary); margin-bottom: 0.5rem; }
    p { color: var(--text-secondary); }
    
    .planner-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .planner-grid { grid-template-columns: 1fr; }
    }

    .destination-row { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
    .btn-icon { background: none; border: none; color: var(--danger); font-size: 1.5rem; cursor: pointer; }
    .btn-add { background: none; border: 1px dashed var(--accent-primary); color: var(--accent-primary); padding: 0.5rem; width: 100%; border-radius: 0.5rem; cursor: pointer; margin-top: 0.5rem; font-weight: 600; }
    .row { display: flex; gap: 1rem; }
    .col { flex: 1; }
    .w-full { width: 100%; justify-content: center; margin-top: 1rem; }

    .info-card { padding: 1rem; }
    h3 { margin-bottom: 1.5rem; color: var(--accent-secondary); }
    .info-list { list-style: none; padding: 0; }
    .info-list li { margin-bottom: 1.25rem; font-size: 0.95rem; color: var(--text-secondary); }
    .info-list strong { color: var(--text-primary); display: block; margin-bottom: 0.25rem; }

    .stats-preview { display: flex; gap: 1.5rem; margin-top: 3rem; }
    .stat { display: flex; flex-direction: column; }
    .stat .label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; }
    .stat .value { font-size: 1.5rem; font-weight: 700; color: var(--accent-primary); }

    .destination-row-group { margin-bottom: 1rem; padding: 1rem; position: relative; }
    .remove-dest { position: absolute; top: 0.5rem; right: 0.5rem; font-size: 1.25rem; }
    .col-sm { flex: 0 0 100px; }
    
    .trip-summary {
      display: flex;
      justify-content: space-around;
      padding: 1rem;
      margin-bottom: 2rem;
      background: rgba(56, 189, 248, 0.05);
      border: 1px solid var(--accent-primary);
    }
    .summary-item { text-align: center; }
    .summary-item .label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; display: block; }
    .summary-item .value { font-size: 1.25rem; font-weight: 700; color: var(--accent-primary); }
    .summary-item.error .value { color: var(--danger); }
    
    .duration-warning {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      margin-top: 1rem;
      border-left: 4px solid var(--danger);
      background: rgba(239, 68, 68, 0.1);
    }
    .warning-icon { font-size: 1.5rem; }
    .warning-text strong { color: var(--danger); display: block; }
    .warning-text p { font-size: 0.875rem; color: var(--text-secondary); margin: 0; }

    .sidebar-alert {
      position: fixed;
      top: 100px;
      right: 2rem;
      width: 300px;
      border-left: 4px solid var(--danger);
      background: rgba(239, 68, 68, 0.15);
      backdrop-filter: blur(10px);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    }
    .alert-content { display: flex; gap: 1rem; padding: 1rem; }
    .alert-icon { font-size: 1.5rem; }
    .alert-text h4 { margin: 0 0 0.25rem; color: var(--danger); font-size: 1rem; }
    .alert-text p { margin: 0; font-size: 0.85rem; color: var(--text-primary); line-height: 1.4; }

    input[type="time"]::-webkit-calendar-picker-indicator {
      display: none;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .stay-dates-hint {
      font-size: 0.65rem;
      color: var(--accent-primary);
      margin-top: 0.25rem;
      white-space: nowrap;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    input[type="date"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }
  `]
})
export class PlannerComponent implements OnInit {
  private cityService = inject(CityService);
  private itineraryService = inject(ItineraryService);
  private router = inject(Router);

  allCities: City[] = [];
  filteredOriginCities: City[] = [];
  countries: string[] = [];
  transportTypes: string[] = ['Avión', 'Bus', 'Tren', 'Helicóptero'];
  loading = false;
  result: any = null;

  itinerary: any = {
    origin: '',
    originCountry: '',
    startDate: '',
    startTime: '08:00',
    returnDate: '',
    returnTime: '20:00',
    passengers: 1,
    travelStyle: 'AVERAGE',
    destinations: [{ country: '', city: '', stayDays: 2, transportType: 'Avión' }],
    budget: 5000,
    strategy: 'BALANCED'
  };

  ngOnInit() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.itinerary.startDate = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    this.itinerary.returnDate = nextWeek.toISOString().split('T')[0];

    this.cityService.getCities().subscribe(data => {
      this.allCities = data;
      this.countries = [...new Set(data.map(c => c.country))].sort();
      
      if (this.countries.length > 0) {
        this.itinerary.originCountry = this.countries[0];
        this.onOriginCountryChange();
        
        this.itinerary.destinations[0].country = this.countries[0];
        this.onDestCountryChange(0);
        this.redistributeDays();
      }
    });
  }

  onOriginCountryChange() {
    this.filteredOriginCities = this.allCities.filter(c => c.country === this.itinerary.originCountry);
    if (this.filteredOriginCities.length > 0) {
      this.itinerary.origin = this.filteredOriginCities[0].name;
    }
  }

  onDestCountryChange(index: number) {
    const dest = this.itinerary.destinations[index];
    const cities = this.getFilteredDestCities(dest.country);
    if (cities.length > 0) {
      dest.city = cities[0].name;
    }
  }

  getFilteredDestCities(country: string): City[] {
    return this.allCities.filter(c => c.country === country);
  }

  getTotalTripDays(): number {
    if (!this.itinerary.startDate || !this.itinerary.returnDate) return 0;
    const start = new Date(this.itinerary.startDate);
    const end = new Date(this.itinerary.returnDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getTotalStayDays(): number {
    return this.itinerary.destinations.reduce((sum: number, dest: any) => sum + (dest.stayDays || 0), 0);
  }

  getDestDates(index: number): string {
    if (!this.itinerary.startDate) return '';
    let current = new Date(this.itinerary.startDate);
    
    // Sum previous stays
    for (let i = 0; i < index; i++) {
      current.setDate(current.getDate() + (this.itinerary.destinations[i].stayDays || 0));
    }
    
    const start = new Date(current);
    current.setDate(current.getDate() + (this.itinerary.destinations[index].stayDays || 0));
    const end = new Date(current);

    const options: any = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('es-ES', options)} - ${end.toLocaleDateString('es-ES', options)}`;
  }

  onDatesChange() {
    this.redistributeDays();
  }

  formatNumberWithDots(value: number): string {
    if (value === undefined || value === null) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  formatCurrency(value: number): string {
    if (value === undefined || value === null) return '$0';
    return '$' + this.formatNumberWithDots(value);
  }

  getEstimatedExpenses(): number {
    const rates: any = {
      'ECONOMIC': 50,
      'AVERAGE': 150,
      'LUXURY': 500
    };
    const rate = rates[this.itinerary.travelStyle] || 150;
    const totalDays = this.getTotalStayDays();
    const passengers = this.itinerary.passengers || 1;
    return rate * totalDays * passengers;
  }

  onBudgetChange(value: string) {
    // Remove all non-numeric characters to get the raw number
    const numericValue = value.replace(/\D/g, '');
    this.itinerary.budget = numericValue ? parseInt(numericValue, 10) : 0;
  }

  onStayDaysChange(index: number) {
    // Logic to handle manual changes if needed
  }

  redistributeDays() {
    const totalDays = this.getTotalTripDays();
    const count = this.itinerary.destinations.length;
    if (totalDays <= 0 || count === 0) return;

    if (count === 1) {
      this.itinerary.destinations[0].stayDays = totalDays;
    } else {
      // Logic for splitting among multiple destinations
      const base = Math.floor(totalDays / count);
      const remainder = totalDays % count;
      
      for (let i = 0; i < count; i++) {
        // Distribute remainder to the first ones
        this.itinerary.destinations[i].stayDays = base + (i < remainder ? 1 : 0);
      }
    }
  }

  addDestination() {
    this.itinerary.destinations.push({ 
      country: this.itinerary.originCountry, 
      city: '', 
      stayDays: 0, 
      transportType: 'Avión' 
    });
    this.onDestCountryChange(this.itinerary.destinations.length - 1);
    this.redistributeDays();
  }

  removeDestination(index: number) {
    this.itinerary.destinations.splice(index, 1);
    this.redistributeDays();
  }

  trackByFn(index: number, item: any) {
    return index;
  }

  onOptimize() {
    this.loading = true;
    const payload = {
      ...this.itinerary,
      destinations: this.itinerary.destinations.map((d: any) => d.city)
    };

    this.itineraryService.optimize(payload).subscribe({
      next: (res) => {
        this.router.navigate(['/itineraries', res.data.id || res.data.id]);
      },
      error: (err) => {
        // Error is now handled inside the service's tap/catchError if we wanted, 
        // but our service returns a mock on error anyway.
        this.loading = false;
      }
    });
  }
}
